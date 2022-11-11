#define MAX_KERNEL_SIZE 10

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D uTexImg;
uniform float uTexSize;
uniform int uKernelSize;
uniform float uKernel[MAX_KERNEL_SIZE * MAX_KERNEL_SIZE];

void main() {
	vec2 texCoord = vTexCoord;
	texCoord.y = 1.0 - texCoord.y;
	float onePixel = 1.0 / uTexSize;
	vec4 result = vec4(0.0);
	int halfSize = uKernelSize / 2;

	for(int y = 0; y < MAX_KERNEL_SIZE; ++y) {
		for(int x = 0; x < MAX_KERNEL_SIZE; ++x) {
			if(x >= uKernelSize) {break;}
			vec2 uv = texCoord + vec2(halfSize - x, halfSize - y) * onePixel;
			float kernelValue = uKernel[x + y * 3];

			result += texture2D(uTexImg, uv) * kernelValue;
		}
		if(y >= uKernelSize) {break;}
	}

	float gray = abs((result.r + result.g + result.b) / 3.0);
	gl_FragColor = vec4(gray, gray, gray, 1.0);
}

