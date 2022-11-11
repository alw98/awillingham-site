#define MAX_KERNEL_SIZE 10
#define uSigmaSpace 10.0
#define uSigmaColor 25.0

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
	vec4 I = vec4(0.0);
	int halfSize = uKernelSize / 2;

	float Ss = pow(uSigmaSpace, 2.0) * 2.0;
	float Sc = pow(uSigmaColor, 2.0) * 2.0;

	highp vec4 TW = vec4(0.0);
	highp vec4 WI = vec4(0.0);
	highp vec4 w;

	for(int y = 0; y < MAX_KERNEL_SIZE; ++y) {
		for(int x = 0; x < MAX_KERNEL_SIZE; ++x) {
			if(x >= uKernelSize) {break;}
			vec2 dx = vec2(halfSize - x, halfSize - y);
			vec2 uv = texCoord + dx * onePixel;
			vec4 Iw = texture2D(uTexImg, uv);
			vec4 dc = (I - Iw) * 255.0;

			w = exp(-dot(dx, dx) / Ss - dc * dc / Sc);
			TW += w;
			WI += Iw * w;
		}
		if(y >= uKernelSize) {break;}
	}

	gl_FragColor = vec4((WI / TW).rgb, 1.0);
}
