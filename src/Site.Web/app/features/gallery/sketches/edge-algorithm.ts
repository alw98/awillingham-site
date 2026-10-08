// The original simple operator: grayscale difference from the left and upper pixel.
export function detectEdges(source: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  if (source.length !== width * height * 4 || width < 1 || height < 1) throw new Error('Invalid image dimensions.');
  const output = new Uint8ClampedArray(source.length);
  const gray = (offset: number) => (source[offset] + source[offset + 1] + source[offset + 2]) / 3;
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
    const i = (y * width + x) * 4;
    const value = Math.abs(gray(i) - gray(i - 4)) + Math.abs(gray(i) - gray(i - width * 4));
    output[i] = output[i + 1] = output[i + 2] = value; output[i + 3] = 255;
  }
  return output;
}
