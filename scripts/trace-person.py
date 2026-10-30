#!/usr/bin/env python3
"""Trace one person in a photo as an SVG outline, for the "Me" highlight.

Uses Segment Anything (SAM ViT-B, via rembg's ONNX models) prompted with a
box around the person and a point or two on them. Writes JSON with the path
in the photo's own pixel coordinates, plus a preview PNG to check the result.

Setup (once):  pip install "rembg[cpu]" opencv-python-headless
               The first run downloads the SAM models (about 375 MB).

Example:
  python3 scripts/trace-person.py public/images/choral-contracting-hero.jpg \\
    --box 1198 674 1348 872 --point 1260 770 --point 1267 707 \\
    --out src/data/outlines/choral-contracting-hero.json

  --box     x0 y0 x1 y1 around the person, in photo pixels
  --point   x y on the person (repeatable)
  --not     x y on something to leave out, such as a neighbor (repeatable)
"""
import argparse
import json
import os

import cv2
import numpy as np
from PIL import Image

# The encoder expects a 684 x 1024 (height x width) canvas, image at top left.
CANVAS_H, CANVAS_W = 684, 1024


def sam_models():
    from rembg import new_session

    session = new_session('sam')
    return session.encoder, session.decoder


def segment(img, box, points, nots):
    # Work on a crop around the box so the person fills more of the model's view.
    x0, y0, x1, y1 = box
    pad_x, pad_y = (x1 - x0) * 0.35, (y1 - y0) * 0.35
    cx0, cy0 = max(0, int(x0 - pad_x)), max(0, int(y0 - pad_y))
    cx1, cy1 = min(img.width, int(x1 + pad_x)), min(img.height, int(y1 + pad_y))
    k = min(CANVAS_W / (cx1 - cx0), CANVAS_H / (cy1 - cy0))
    crop = img.crop((cx0, cy0, cx1, cy1)).resize(
        (round((cx1 - cx0) * k), round((cy1 - cy0) * k)), Image.LANCZOS)
    canvas = np.zeros((CANVAS_H, CANVAS_W, 3), np.float32)
    canvas[:crop.height, :crop.width] = np.asarray(crop)

    encoder, decoder = sam_models()
    emb = encoder.run(None, {encoder.get_inputs()[0].name: canvas})[0]

    to_canvas = lambda x, y: [(x - cx0) * k, (y - cy0) * k]
    coords = [to_canvas(*p) for p in points] + [to_canvas(*p) for p in nots]
    labels = [1] * len(points) + [0] * len(nots)
    coords += [to_canvas(x0, y0), to_canvas(x1, y1)]
    labels += [2, 3]
    masks, iou, _ = decoder.run(None, {
        'image_embeddings': emb,
        'point_coords': np.array([coords], np.float32),
        'point_labels': np.array([labels], np.float32),
        'mask_input': np.zeros((1, 1, 256, 256), np.float32),
        'has_mask_input': np.zeros(1, np.float32),
        'orig_im_size': np.array([CANVAS_H, CANVAS_W], np.float32),
    })
    mask = (masks[0, 0][:crop.height, :crop.width] > 0).astype(np.uint8)

    # Back to full-photo pixels.
    full = np.zeros((img.height, img.width), np.uint8)
    full[cy0:cy1, cx0:cx1] = cv2.resize(mask, (cx1 - cx0, cy1 - cy0), interpolation=cv2.INTER_LINEAR)
    return full, float(iou[0, 0])


def clean(mask):
    # Keep the largest piece, fill holes, and smooth the edge slightly.
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    if n > 1:
        biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        mask = (labels == biggest).astype(np.uint8)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    filled = np.zeros_like(mask)
    cv2.drawContours(filled, contours, -1, 1, cv2.FILLED)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    return cv2.morphologyEx(filled, cv2.MORPH_OPEN, k)


def to_path(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(contours, key=cv2.contourArea)
    c = cv2.approxPolyDP(c, 1.0, True)[:, 0, :]
    d = 'M' + ' L'.join(f'{x} {y}' for x, y in c) + 'Z'
    top = c[np.argmin(c[:, 1])]
    return d, [int(top[0]), int(top[1])], cv2.boundingRect(c)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('image')
    ap.add_argument('--box', nargs=4, type=float, required=True)
    ap.add_argument('--point', nargs=2, type=float, action='append', default=[])
    ap.add_argument('--not', dest='nots', nargs=2, type=float, action='append', default=[])
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    img = Image.open(args.image).convert('RGB')
    mask, iou = segment(img, args.box, args.point, args.nots)
    mask = clean(mask)
    d, top, (bx, by, bw, bh) = to_path(mask)

    os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
    with open(args.out, 'w') as f:
        json.dump({
            'image': '/' + os.path.relpath(args.image, 'public'),
            'width': img.width,
            'height': img.height,
            'path': d,
            'top': top,
            'bounds': [bx, by, bw, bh],
        }, f, indent=2)
        f.write('\n')

    preview = np.asarray(img).astype(float)
    a = mask[..., None].astype(bool)
    preview = np.where(a, preview * 0.4 + np.array([198, 58, 43]) * 0.6, preview * 0.45)
    pad = 40
    crop = preview[max(0, by - pad):by + bh + pad, max(0, bx - pad):bx + bw + pad]
    prev_path = os.path.splitext(args.out)[0] + '.preview.png'
    Image.fromarray(crop.astype(np.uint8)).save(prev_path)
    print(f'model confidence {iou:.3f}; {len(d)} bytes of path; wrote {args.out} and {prev_path}')


if __name__ == '__main__':
    main()
