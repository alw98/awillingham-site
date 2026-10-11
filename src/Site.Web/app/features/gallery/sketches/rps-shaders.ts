export const vertexShader = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const stateHeader = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;
uniform usampler2D uState;
uniform int uSize;
uniform uint uSeed;
layout(location = 0) out uvec4 outputState;
uint hash(uint v) {
  v = (v ^ (v >> 16)) * 0x7feb352du;
  v = (v ^ (v >> 15)) * 0x846ca68bu;
  return v ^ (v >> 16);
}
`;

export const simulationShader = stateHeader + `
uniform uint uGeneration;
void interact(inout uint actor, inout uint target) {
  uint color = actor & 3u, level = actor >> 2;
  if (color == 0u) return;
  if (target == 0u && level > 0u) target = ((level - 1u) << 2) | color;
  else if ((target & 3u) == (color + 1u) % 3u + 1u) {
    target = (target >> 2) > 0u ? target - 4u : color;
    actor = (min(4u, level + 1u) << 2) | color;
  }
}
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  ivec2 shift = ivec2(int(uGeneration & 1u), int((uGeneration >> 1) & 1u));
  ivec2 q = (p - shift + uSize) % uSize;
  ivec2 block = (q / 2) * 2;
  uint key = hash(uint(block.y * uSize + block.x) * 0x9e3779b9u ^ uGeneration * 0x85ebca6bu ^ uSeed);
  int choice = int(key & 3u), mask = choice < 2 ? choice + 1 : 3;
  int local = (q.x & 1) + (q.y & 1) * 2;
  int a = min(local, local ^ mask), b = a ^ mask;
  ivec2 pa = (block + ivec2(a & 1, a >> 1) + shift) % uSize;
  ivec2 pb = (block + ivec2(b & 1, b >> 1) + shift) % uSize;
  uint first = texelFetch(uState, pa, 0).r, second = texelFetch(uState, pb, 0).r;
  // Both fragments calculate the same pair. Each writes only its own cell.
  uint roll = hash(key ^ uint(a));
  bool reverse = (roll & 1u) != 0u;
  if (reverse) { uint t = first; first = second; second = t; }
  if (hash(roll ^ 0xa511e9b3u) % 9u != 0u) interact(first, second);
  if (hash(roll ^ 0x63d83595u) % 9u != 0u) interact(second, first);
  if (reverse) { uint t = first; first = second; second = t; }
  outputState = uvec4(local == a ? first : second, 0, 0, 1);
}`;

export const paintShader = stateHeader + `
uniform vec2 uFrom, uTo;
uniform float uRadius;
uniform uint uColor;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec2 delta = uTo - uFrom;
  bool painted = false;
  if (uRadius == 1.0) {
    // Rasterize a one-cell DDA stroke without a CPU list of brush cells.
    float steps = max(1.0, ceil(max(abs(delta.x), abs(delta.y))));
    bool horizontal = abs(delta.x) >= abs(delta.y);
    float along = horizontal ? float(p.x) + 0.5 - uFrom.x : float(p.y) + 0.5 - uFrom.y;
    float major = horizontal ? delta.x : delta.y;
    float nearest = abs(major) < 0.00001 ? 0.0 : round(along / major * steps);
    for (int i = -1; i <= 1; i++) {
      float t = clamp((nearest + float(i)) / steps, 0.0, 1.0);
      painted = painted || all(equal(p, ivec2(floor(uFrom + delta * t))));
    }
  } else {
    vec2 offset = vec2(p) + 0.5 - uFrom;
    float t = clamp(dot(offset, delta) / max(dot(delta, delta), 0.0001), 0.0, 1.0);
    painted = length(offset - delta * t) <= uRadius;
  }
  outputState = uvec4(painted ? 16u | uColor : texelFetch(uState, p, 0).r, 0, 0, 1);
}`;

export const seedShader = stateHeader + `
uniform bool uPreview;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  uint color = hash(uint(p.y * uSize + p.x) ^ uSeed) % 3u + 1u;
  if (uPreview) {
    vec2 d = (vec2(p) - float(uSize) * 0.5) / float(uSize);
    float radius = length(d);
    float phase = mod((atan(d.y, d.x) + float(uSeed % 6283u) * 0.001 + radius * 25.0) / 6.2831853 * 3.0, 3.0);
    color = radius < 0.42 && fract(phase) < 0.72 ? uint(floor(phase)) + 1u : 0u;
  }
  outputState = uvec4(color == 0u ? 0u : 16u | color, 0, 0, 1);
}`;

export const displayShader = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;
uniform usampler2D uState;
uniform int uSize;
uniform vec2 uScreen, uCenter;
uniform float uScale;
out vec4 outputColor;
void main() {
  vec2 screen = vec2(gl_FragCoord.x, uScreen.y - gl_FragCoord.y);
  ivec2 p = ivec2(floor(uCenter + (screen - uScreen * 0.5) / uScale));
  uint state = 0u;
  if (all(greaterThanEqual(p, ivec2(0))) && all(lessThan(p, ivec2(uSize))))
    state = texelFetch(uState, p, 0).r & 3u;
  vec3 color = state == 1u ? vec3(1, 0, 0) : state == 2u ? vec3(0, 1, 0) : state == 3u ? vec3(0, 0, 1) : vec3(0);
  outputColor = vec4(color, 1);
}`;
