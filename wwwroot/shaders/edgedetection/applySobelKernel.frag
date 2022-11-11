#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D uTexImg;
uniform float uTexSize;

void main() {
	vec2 texCoord = vTexCoord;
	texCoord.y = 1.0 - texCoord.y;
	float onePixel = 1.0 / uTexSize;
	vec4 result = vec4(0.0);

	vec4 leftPx = texture2D(uTexImg, texCoord + vec2(-1.0, 0.0) * onePixel);
	vec4 upPx = texture2D(uTexImg, texCoord + vec2(0, -1.0) * onePixel);
	vec4 cur = texture2D(uTexImg, texCoord);
	vec4 dy = abs(cur - upPx);
	vec4 dx = abs(cur - leftPx);
	vec4 combined = dy + dx;

	gl_FragColor = vec4(combined.rgb, 1.0);
}

