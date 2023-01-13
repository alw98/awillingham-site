#ifdef GL_ES
precision mediump float;
#endif        

// The texture to be convolved
uniform sampler2D tex;
// The kernel to be used in the convolution
uniform float kernel[9];
// The size of the kernel
uniform int kernelSize;
// The width and height of the texture,
// used to calculate texture coordinates
uniform vec2 texSize;
&#012;
// The width and height of the convolution
// kernel, used to calculate the offset
// for each sample in the kernel
uniform vec2 kernelOffset;

void main() {
  // The final color for this fragment
  vec4 color = vec4(0.0);

  // Loop through all the samples in the kernel
  for (int i = 0; i < kernelSize; i++) {
    // Calculate the offset for this sample
    vec2 offset = kernelOffset * i;

    // Sample the texture at this offset
    color += texture(tex, gl_TexCoord[0].st + offset) * kernel[i];
  }

  // Set the final color for this fragment
  gl_FragColor = color;
}