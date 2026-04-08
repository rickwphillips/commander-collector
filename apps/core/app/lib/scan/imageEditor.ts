/**
 * Pure image-editing helpers for the deck scan pipeline.
 * No React, no side effects beyond canvas operations.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** A base64-encoded image tile with its MIME type. */
export interface ImageTile {
  base64: string;
  mimeType: string;
}

/** Result of processing a File through rotation/brightness/contrast/zoom/pan. */
export interface ProcessedImage extends ImageTile {
  /** The live canvas element (used to split into tiles). */
  canvas: HTMLCanvasElement;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Crops a data URL image to a fractional sub-region and returns a JPEG data URL.
 * All coordinates (x, y, w, h) are fractional (0–1) relative to the image dimensions.
 */
export function cropDataUrl(
  dataUrl: string,
  x: number, y: number, w: number, h: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const sw = Math.round(img.width * w);
      const sh = Math.round(img.height * h);
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      ctx.drawImage(img, img.width * x, img.height * y, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Splits a source canvas into a cols×rows grid of overlapping tiles.
 * Each tile has an 8% overlap on each edge so cards near boundaries are
 * fully visible in at least one tile.
 */
export function splitCanvasToTiles(
  source: HTMLCanvasElement,
  cols: number,
  rows: number,
): ImageTile[] {
  const W = source.width;
  const H = source.height;
  const tileW = Math.ceil(W / cols);
  const tileH = Math.ceil(H / rows);
  // 8% overlap on each edge so cards near boundaries are fully visible in at least one tile
  const overlapX = Math.round(tileW * 0.08);
  const overlapY = Math.round(tileH * 0.08);
  const tiles: ImageTile[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = Math.max(0, col * tileW - overlapX);
      const sy = Math.max(0, row * tileH - overlapY);
      const ex = Math.min(W, (col + 1) * tileW + overlapX);
      const ey = Math.min(H, (row + 1) * tileH + overlapY);
      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = ex - sx;
      tileCanvas.height = ey - sy;
      tileCanvas.getContext('2d')!.drawImage(source, sx, sy, ex - sx, ey - sy, 0, 0, ex - sx, ey - sy);
      const dataUrl = tileCanvas.toDataURL('image/jpeg', 0.88);
      tiles.push({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
    }
  }
  return tiles;
}

/**
 * Processes a File through rotation, brightness/contrast, zoom and pan adjustments.
 * Returns a base64 JPEG, its MIME type, and the rendered canvas (for tile splitting).
 * Caps the longest dimension at 3000px.
 */
export async function fileToBase64(
  file: File,
  rotation: number,
  brightness: number,
  contrast: number,
  zoom: number = 1,
  panX: number = 0,
  panY: number = 0,
): Promise<ProcessedImage> {
  const MAX_PX = 3000;

  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

  try {
    const bitmap = await createImageBitmap(file);
    const origW = bitmap.width;
    const origH = bitmap.height;

    // Scale the source so the longest side fits MAX_PX
    let sw = origW, sh = origH;
    if (Math.max(sw, sh) > MAX_PX) {
      const scale = MAX_PX / Math.max(sw, sh);
      sw = Math.round(sw * scale);
      sh = Math.round(sh * scale);
    }

    // Output canvas dimensions swap when rotating 90° or 270°
    const swapped = rotation === 90 || rotation === 270;
    const outW = swapped ? sh : sw;
    const outH = swapped ? sw : sh;

    const canvas = document.createElement('canvas');
    canvas.width  = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    // Apply zoom and pan — panX/panY are percentages of image size
    const drawW = sw * zoom;
    const drawH = sh * zoom;
    const offsetX = (panX / 100) * sw;
    const offsetY = (panY / 100) * sh;
    ctx.drawImage(bitmap, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
    bitmap.close();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg', canvas };
  } catch (err) {
    if (isHeic) {
      throw new Error(
        'Could not convert HEIC. Open the photo in Preview → Export as JPEG, then upload that.'
      );
    }
    throw new Error('Could not process image: ' + (err instanceof Error ? err.message : String(err)));
  }
}
