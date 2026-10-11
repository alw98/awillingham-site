import { displayShader, paintShader, seedShader, simulationShader, vertexShader } from './rps-shaders';
import type { Point } from './types';

type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };
export class RpsGpu {
  private readonly programs: Program[] = [];
  private readonly textures: WebGLTexture[] = [];
  private readonly buffers: WebGLFramebuffer[] = [];
  private current = 0;
  private pending: WebGLSync | null = null;
  private simulation!: Program;
  private paint!: Program;
  private seedBoard!: Program;
  readonly display: Program;
  generation = 0;

  constructor(readonly gl: WebGL2RenderingContext, readonly size: number, readonly seed: number) {
    try {
      const limit = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), ...gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array);
      if (size > limit) {
        const error = new Error(`Your graphics device supports boards up to ${limit} × ${limit}. Choose a smaller board in Settings.`);
        error.name = 'RpsBoardSizeError'; throw error;
      }
      gl.disable(gl.DITHER); gl.disable(gl.BLEND);
      this.simulation = this.program(simulationShader, ['uGeneration', 'uSeed']);
      this.paint = this.program(paintShader, ['uFrom', 'uTo', 'uRadius', 'uColor']);
      this.seedBoard = this.program(seedShader, ['uPreview', 'uSeed']);
      this.display = this.program(displayShader, ['uScreen', 'uCenter', 'uScale']);
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture(), buffer = gl.createFramebuffer();
        if (texture) this.textures.push(texture);
        if (buffer) this.buffers.push(buffer);
        if (!texture || !buffer) throw new Error('Unable to allocate board.');
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // One byte contains both color (bits 0–1) and level (bits 2–4).
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8UI, size, size);
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE || gl.getError() !== gl.NO_ERROR) throw new Error('Unable to allocate board.');
        gl.clearBufferuiv(gl.COLOR, 0, new Uint32Array(4));
      }
    } catch (error) { this.dispose(); throw error; }
  }

  private program(fragment: string, names: string[]): Program {
    const gl = this.gl, shaders: WebGLShader[] = [], program = gl.createProgram();
    if (!program) throw new Error('Unable to create shader program.');
    const result: Program = { program, uniforms: {} }; this.programs.push(result);
    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragment]] as const) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error('Unable to create shader.');
        shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation failed.');
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Shader linking failed.');
      result.uniforms = Object.fromEntries(['uState', 'uSize', ...names].map(name => [name, gl.getUniformLocation(program, name)]));
      return result;
    } finally { for (const shader of shaders) gl.deleteShader(shader); }
  }

  bind(program: Program) {
    const gl = this.gl;
    gl.useProgram(program.program); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.textures[this.current]);
    gl.uniform1i(program.uniforms.uState, 0); gl.uniform1i(program.uniforms.uSize, this.size);
  }

  private pass(program: Program, uniforms: () => void) {
    const gl = this.gl;
    this.bind(program); gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers[1 - this.current]); gl.viewport(0, 0, this.size, this.size);
    uniforms(); gl.drawArrays(gl.TRIANGLES, 0, 3); this.current = 1 - this.current;
  }

  ready() {
    if (!this.pending) return true;
    const status = this.gl.clientWaitSync(this.pending, 0, 0);
    if (status === this.gl.WAIT_FAILED) throw new Error('Graphics synchronization failed.');
    if (status === this.gl.TIMEOUT_EXPIRED) return false;
    this.gl.deleteSync(this.pending); this.pending = null; return true;
  }

  step(count: number) {
    const gl = this.gl, u = this.simulation.uniforms;
    for (let i = 0; i < count; i++) {
      this.pass(this.simulation, () => { gl.uniform1ui(u.uSeed, this.seed); gl.uniform1ui(u.uGeneration, this.generation); });
      this.generation++;
    }
    if (this.pending) gl.deleteSync(this.pending);
    this.pending = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); gl.flush();
  }

  stroke(from: Point, to: Point, color: number, radius: number) {
    const gl = this.gl, u = this.paint.uniforms;
    this.pass(this.paint, () => { gl.uniform2f(u.uFrom, from.x, from.y); gl.uniform2f(u.uTo, to.x, to.y); gl.uniform1f(u.uRadius, radius); gl.uniform1ui(u.uColor, color); });
  }

  fill(preview: boolean) {
    const gl = this.gl, u = this.seedBoard.uniforms;
    this.pass(this.seedBoard, () => { gl.uniform1i(u.uPreview, Number(preview)); gl.uniform1ui(u.uSeed, this.seed); });
  }

  clear() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers[this.current]); gl.clearBufferuiv(gl.COLOR, 0, new Uint32Array(4)); this.generation = 0;
  }

  dispose() {
    const gl = this.gl;
    if (this.pending) gl.deleteSync(this.pending); this.pending = null;
    for (const { program } of this.programs) gl.deleteProgram(program);
    for (const texture of this.textures) gl.deleteTexture(texture);
    for (const buffer of this.buffers) gl.deleteFramebuffer(buffer);
  }
}
