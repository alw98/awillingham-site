import p5 from 'p5';

const getGrayScaleValue = (image: p5.Image, index: number) => {
	const r = image.pixels[index];
	const g = image.pixels[index + 1];
	const b = image.pixels[index + 2];
	return (r + g + b) / 3;
};

const getEdgeDetectedPixel = (image: p5.Image, x: number, y: number) => {
	const index = 4 * x + image.width * y * 4;
	const leftIndex = 4 * (x - 1) + image.width * y * 4;
	const upIndex = 4 * x + image.width * (y - 1) * 4;
	const leftGrayScale = getGrayScaleValue(image, leftIndex);
	const upGrayScale = getGrayScaleValue(image, upIndex);
	const curGrayScale = getGrayScaleValue(image, index);
	return Math.abs(curGrayScale - leftGrayScale) + Math.abs(curGrayScale - upGrayScale);
};

export const detectEdges = (input: p5.Image, output: p5.Image) => {
	input.loadPixels();
	output.loadPixels();
	for (let i = 1; i < input.height - 1; ++i) {
		for (let j = 1; j < input.width - 1; ++j) {
			const brightness = getEdgeDetectedPixel(input, j, i);
			const index = 4 * j + input.width * i * 4;

			output.pixels[index] = brightness;
			output.pixels[index + 1] = brightness;
			output.pixels[index + 2] = brightness;
			output.pixels[index + 3] = 255;
		}
	}
	output.updatePixels();
};
