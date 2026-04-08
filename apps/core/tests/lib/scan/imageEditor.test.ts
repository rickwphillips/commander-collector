/**
 * Canvas mocking strategy: Option B — spy-based.
 *
 * jsdom does not implement the Canvas 2D API (getContext returns null,
 * toDataURL returns empty string, drawImage is a no-op). Rather than
 * pulling in a heavyweight canvas mock library (which would require an
 * additional devDependency), we install targeted vi.spyOn / manual mocks
 * for the specific canvas API surface that each function touches.
 *
 * What we test:
 *   - That functions call the canvas API with the correct arguments.
 *   - That functions return the expected shape (data URL string, tile count, etc.).
 * What we do NOT test:
 *   - Pixel-level output (no canvas mock can replicate GPU rendering in jsdom).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cropDataUrl, splitCanvasToTiles, fileToBase64 } from '@/lib/scan/imageEditor';

// ─── Minimal base64 PNG fixture (1×1 red pixel) ──────────────────────────────
// Keeps binary off disk; inline is fine for unit tests.
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==';
const TINY_DATA_URL = `data:image/png;base64,${TINY_PNG_BASE64}`;

// ─── cropDataUrl ──────────────────────────────────────────────────────────────

describe('cropDataUrl', () => {
  let origImage: typeof globalThis.Image;
  let origCreateElement: typeof document.createElement;

  beforeEach(() => {
    origImage = globalThis.Image;
    origCreateElement = document.createElement.bind(document);
  });

  afterEach(() => {
    globalThis.Image = origImage;
    document.createElement = origCreateElement;
    vi.restoreAllMocks();
  });

  function setupCropMocks(imgWidth: number, imgHeight: number) {
    const drawImage = vi.fn();
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,fakeJpeg');

    const mockCtx = { drawImage };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL,
    };

    // Stub document.createElement to return our mock canvas
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLElement;
      return origCreateElement(tag);
    });

    // Stub Image constructor so onload fires synchronously with known dimensions
    class MockImage {
      width = imgWidth;
      height = imgHeight;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      private _src = '';
      get src() { return this._src; }
      set src(v: string) {
        this._src = v;
        // Fire onload synchronously when src is set
        if (this.onload) this.onload();
      }
    }
    globalThis.Image = MockImage as unknown as typeof globalThis.Image;

    return { drawImage, toDataURL, mockCanvas, mockCtx };
  }

  it('resolves to a string', async () => {
    setupCropMocks(100, 200);
    const result = await cropDataUrl(TINY_DATA_URL, 0, 0, 1, 1);
    expect(typeof result).toBe('string');
  });

  it('returns the data URL produced by canvas.toDataURL', async () => {
    const { toDataURL } = setupCropMocks(100, 200);
    toDataURL.mockReturnValue('data:image/jpeg;base64,specificJpeg');
    const result = await cropDataUrl(TINY_DATA_URL, 0, 0, 1, 1);
    expect(result).toBe('data:image/jpeg;base64,specificJpeg');
  });

  it('sets canvas dimensions to the rounded pixel crop region', async () => {
    // img 100×200, crop w=0.5, h=0.5 → sw=50, sh=100
    const { mockCanvas } = setupCropMocks(100, 200);
    await cropDataUrl(TINY_DATA_URL, 0, 0, 0.5, 0.5);
    expect(mockCanvas.width).toBe(50);
    expect(mockCanvas.height).toBe(100);
  });

  it('calls drawImage with the correct crop region arguments', async () => {
    // img 200×400, crop x=0.25, y=0.25, w=0.5, h=0.5
    // sx=50, sy=100, sw=100, sh=200
    const { drawImage } = setupCropMocks(200, 400);
    await cropDataUrl(TINY_DATA_URL, 0.25, 0.25, 0.5, 0.5);

    expect(drawImage).toHaveBeenCalledTimes(1);
    const [_img, sx, sy, sw, sh, dx, dy, dw, dh] = drawImage.mock.calls[0];
    expect(sx).toBe(50);   // 200 * 0.25
    expect(sy).toBe(100);  // 400 * 0.25
    expect(sw).toBe(100);  // Math.round(200 * 0.5)
    expect(sh).toBe(200);  // Math.round(400 * 0.5)
    expect(dx).toBe(0);
    expect(dy).toBe(0);
    expect(dw).toBe(100);
    expect(dh).toBe(200);
  });

  it('calls toDataURL with image/jpeg', async () => {
    const { toDataURL } = setupCropMocks(100, 100);
    await cropDataUrl(TINY_DATA_URL, 0, 0, 1, 1);
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.85);
  });

  it('rejects when canvas context is unavailable', async () => {
    // Same image mock but ctx returns null
    class MockImage {
      width = 100;
      height = 100;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      set src(_: string) { if (this.onload) this.onload(); }
    }
    globalThis.Image = MockImage as unknown as typeof globalThis.Image;

    const nullCtxCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => null),
      toDataURL: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return nullCtxCanvas as unknown as HTMLElement;
      return origCreateElement(tag);
    });

    await expect(cropDataUrl(TINY_DATA_URL, 0, 0, 1, 1)).rejects.toThrow('No canvas context');
  });
});

// ─── splitCanvasToTiles ───────────────────────────────────────────────────────

describe('splitCanvasToTiles', () => {
  let origCreateElement: typeof document.createElement;

  beforeEach(() => {
    origCreateElement = document.createElement.bind(document);
  });

  afterEach(() => {
    document.createElement = origCreateElement;
    vi.restoreAllMocks();
  });

  function makeSourceCanvas(width: number, height: number): HTMLCanvasElement {
    return { width, height } as HTMLCanvasElement;
  }

  function stubTileCanvas() {
    const drawImage = vi.fn();
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,tileData');
    const tileCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage })),
      toDataURL,
    };
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return { ...tileCanvas } as unknown as HTMLElement;
      return origCreateElement(tag);
    });
    return { drawImage, toDataURL };
  }

  it('produces cols * rows tiles', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(400, 400);
    const tiles = splitCanvasToTiles(source, 2, 3);
    expect(tiles).toHaveLength(6);
  });

  it('produces 1 tile for a 1×1 grid', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(200, 200);
    const tiles = splitCanvasToTiles(source, 1, 1);
    expect(tiles).toHaveLength(1);
  });

  it('produces 4 tiles for a 2×2 grid', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(300, 300);
    const tiles = splitCanvasToTiles(source, 2, 2);
    expect(tiles).toHaveLength(4);
  });

  it('each tile has a base64 string and mimeType', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(100, 100);
    const tiles = splitCanvasToTiles(source, 1, 1);
    expect(tiles[0]).toMatchObject({
      base64: expect.any(String),
      mimeType: 'image/jpeg',
    });
  });

  it('base64 is the part after the comma in the data URL', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(100, 100);
    const tiles = splitCanvasToTiles(source, 1, 1);
    // toDataURL returns 'data:image/jpeg;base64,tileData', so base64 = 'tileData'
    expect(tiles[0].base64).toBe('tileData');
  });

  it('mimeType is always image/jpeg', () => {
    stubTileCanvas();
    const source = makeSourceCanvas(200, 200);
    const tiles = splitCanvasToTiles(source, 2, 2);
    for (const tile of tiles) {
      expect(tile.mimeType).toBe('image/jpeg');
    }
  });

  it('applies 8% overlap: first tile sx=0 (no negative clamped overlap)', () => {
    // With a 400×400 canvas split 2×2:
    //   tileW = ceil(400/2) = 200, overlapX = round(200*0.08) = 16
    //   col=0: sx = max(0, 0*200 - 16) = 0
    //   col=1: sx = max(0, 1*200 - 16) = 184
    const drawImage = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({ drawImage })),
          toDataURL: vi.fn(() => 'data:image/jpeg;base64,x'),
        } as unknown as HTMLElement;
      }
      return origCreateElement(tag);
    });

    const source = makeSourceCanvas(400, 400);
    splitCanvasToTiles(source, 2, 2);

    // First drawImage call (col=0, row=0): sx=0, sy=0
    const [_src, sx, sy] = drawImage.mock.calls[0];
    expect(sx).toBe(0);
    expect(sy).toBe(0);
  });

  it('applies 8% overlap: second column tile starts before the clean boundary', () => {
    const drawImage = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({ drawImage })),
          toDataURL: vi.fn(() => 'data:image/jpeg;base64,x'),
        } as unknown as HTMLElement;
      }
      return origCreateElement(tag);
    });

    // 400×100 canvas, 2 cols × 1 row
    // tileW=200, overlapX=16
    // col=0: sx=0, col=1: sx=max(0, 200-16)=184
    const source = makeSourceCanvas(400, 100);
    splitCanvasToTiles(source, 2, 1);

    // Second drawImage call (col=1, row=0)
    const [_src, sx] = drawImage.mock.calls[1];
    expect(sx).toBe(184);
  });
});

// ─── fileToBase64 ─────────────────────────────────────────────────────────────

describe('fileToBase64', () => {
  let origCreateElement: typeof document.createElement;
  let origCreateImageBitmap: typeof globalThis.createImageBitmap;

  beforeEach(() => {
    origCreateElement = document.createElement.bind(document);
    origCreateImageBitmap = globalThis.createImageBitmap;
  });

  afterEach(() => {
    document.createElement = origCreateElement;
    globalThis.createImageBitmap = origCreateImageBitmap;
    vi.restoreAllMocks();
  });

  function makeFile(name = 'photo.jpg', type = 'image/jpeg'): File {
    return new File([new Uint8Array([1, 2, 3])], name, { type });
  }

  function setupFileToBase64Mocks(bitmapW = 100, bitmapH = 200) {
    const drawImage = vi.fn();
    const translate = vi.fn();
    const rotate = vi.fn();
    const toDataURL = vi.fn(() => 'data:image/jpeg;base64,processedData');

    let filterVal = '';
    const mockCtx = {
      drawImage,
      translate,
      rotate,
      get filter() { return filterVal; },
      set filter(v: string) { filterVal = v; },
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL,
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLElement;
      return origCreateElement(tag);
    });

    // Mock createImageBitmap
    const mockBitmap = {
      width: bitmapW,
      height: bitmapH,
      close: vi.fn(),
    };
    globalThis.createImageBitmap = vi.fn().mockResolvedValue(mockBitmap);

    return { drawImage, translate, rotate, toDataURL, mockCanvas, mockCtx, mockBitmap };
  }

  it('returns an object with base64, mimeType, and canvas fields', async () => {
    setupFileToBase64Mocks();
    const result = await fileToBase64(makeFile(), 0, 100, 100);
    expect(result).toMatchObject({
      base64: expect.any(String),
      mimeType: 'image/jpeg',
      canvas: expect.any(Object),
    });
  });

  it('base64 is the data URL content after the comma', async () => {
    const { toDataURL } = setupFileToBase64Mocks();
    toDataURL.mockReturnValue('data:image/jpeg;base64,specificProcessed');
    const result = await fileToBase64(makeFile(), 0, 100, 100);
    expect(result.base64).toBe('specificProcessed');
  });

  it('mimeType is always image/jpeg', async () => {
    setupFileToBase64Mocks();
    const result = await fileToBase64(makeFile(), 0, 100, 100);
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('sets canvas dimensions to bitmap dimensions when no rotation', async () => {
    // bitmapW=300, bitmapH=400, rotation=0 → outW=300, outH=400
    const { mockCanvas } = setupFileToBase64Mocks(300, 400);
    await fileToBase64(makeFile(), 0, 100, 100);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);
  });

  it('swaps canvas dimensions for 90° rotation', async () => {
    // bitmapW=300, bitmapH=400, rotation=90 → outW=400, outH=300
    const { mockCanvas } = setupFileToBase64Mocks(300, 400);
    await fileToBase64(makeFile(), 90, 100, 100);
    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
  });

  it('swaps canvas dimensions for 270° rotation', async () => {
    const { mockCanvas } = setupFileToBase64Mocks(300, 400);
    await fileToBase64(makeFile(), 270, 100, 100);
    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
  });

  it('does not swap canvas dimensions for 180° rotation', async () => {
    const { mockCanvas } = setupFileToBase64Mocks(300, 400);
    await fileToBase64(makeFile(), 180, 100, 100);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);
  });

  it('caps the longest dimension at 3000px and scales proportionally', async () => {
    // bitmapW=6000, bitmapH=3000 → scale=3000/6000=0.5 → sw=3000, sh=1500
    // rotation=0 → outW=3000, outH=1500
    const { mockCanvas } = setupFileToBase64Mocks(6000, 3000);
    await fileToBase64(makeFile(), 0, 100, 100);
    expect(mockCanvas.width).toBe(3000);
    expect(mockCanvas.height).toBe(1500);
  });

  it('applies brightness and contrast via ctx.filter', async () => {
    const { mockCtx } = setupFileToBase64Mocks();
    await fileToBase64(makeFile(), 0, 120, 80);
    expect(mockCtx.filter).toBe('brightness(120%) contrast(80%)');
  });

  it('calls ctx.rotate with the angle in radians', async () => {
    const { rotate } = setupFileToBase64Mocks();
    await fileToBase64(makeFile(), 90, 100, 100);
    // 90 degrees = PI/2
    expect(rotate).toHaveBeenCalledWith(Math.PI / 2);
  });

  it('calls ctx.translate to center the canvas', async () => {
    // outW=100, outH=200, rotation=0 → translate(50, 100)
    const { translate } = setupFileToBase64Mocks(100, 200);
    await fileToBase64(makeFile(), 0, 100, 100);
    expect(translate).toHaveBeenCalledWith(50, 100);
  });

  it('calls ctx.drawImage with zoom=1 and no pan (default)', async () => {
    // bitmapW=100, bitmapH=200, rotation=0, zoom=1, panX=0, panY=0
    // drawW=100, drawH=200, offsetX=0, offsetY=0
    // drawImage(bitmap, -50, -100, 100, 200)
    const { drawImage } = setupFileToBase64Mocks(100, 200);
    await fileToBase64(makeFile(), 0, 100, 100);
    const [_bmp, x, y, w, h] = drawImage.mock.calls[0];
    expect(x).toBe(-50);
    expect(y).toBe(-100);
    expect(w).toBe(100);
    expect(h).toBe(200);
  });

  it('applies zoom factor to draw dimensions', async () => {
    // bitmapW=100, bitmapH=200, zoom=2 → drawW=200, drawH=400
    const { drawImage } = setupFileToBase64Mocks(100, 200);
    await fileToBase64(makeFile(), 0, 100, 100, 2);
    const [_bmp, _x, _y, w, h] = drawImage.mock.calls[0];
    expect(w).toBe(200);
    expect(h).toBe(400);
  });

  it('applies panX/panY as percentage offsets', async () => {
    // bitmapW=100, bitmapH=200, zoom=1, panX=50, panY=25
    // offsetX=(50/100)*100=50, offsetY=(25/100)*200=50
    // x = -drawW/2 + offsetX = -50 + 50 = 0
    // y = -drawH/2 + offsetY = -100 + 50 = -50
    const { drawImage } = setupFileToBase64Mocks(100, 200);
    await fileToBase64(makeFile(), 0, 100, 100, 1, 50, 25);
    const [_bmp, x, y] = drawImage.mock.calls[0];
    expect(x).toBe(0);
    expect(y).toBe(-50);
  });

  it('closes the bitmap after drawing', async () => {
    const { mockBitmap } = setupFileToBase64Mocks();
    await fileToBase64(makeFile(), 0, 100, 100);
    expect(mockBitmap.close).toHaveBeenCalledTimes(1);
  });

  it('throws a HEIC-specific error for .heic files when createImageBitmap fails', async () => {
    globalThis.createImageBitmap = vi.fn().mockRejectedValue(new Error('unsupported'));
    const heicFile = makeFile('photo.heic', 'image/heic');
    await expect(fileToBase64(heicFile, 0, 100, 100)).rejects.toThrow(
      'Could not convert HEIC'
    );
  });

  it('throws a generic error for non-HEIC files when createImageBitmap fails', async () => {
    globalThis.createImageBitmap = vi.fn().mockRejectedValue(new Error('bad image'));
    await expect(fileToBase64(makeFile(), 0, 100, 100)).rejects.toThrow(
      'Could not process image'
    );
  });
});
