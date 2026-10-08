import type { ThemeColors } from '../../themes/preferences';

export type Settings = Record<string, number | boolean | string>;
export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export interface SketchInstance {
  resize(size: Size): void;
  update(milliseconds: number): void;
  draw(context: CanvasRenderingContext2D, colors: ThemeColors): void;
  input?(action: string, point?: Point): void;
  configure?(settings: Settings, previous?: Settings): boolean | void;
  summary?(): string;
  dispose(): void;
}
export interface FactoryOptions {
  settings: Settings;
  seed: number;
  preview: boolean;
  signal: AbortSignal;
}
export type SketchFactory = (options: FactoryOptions) => SketchInstance | Promise<SketchInstance>;
export interface Control {
  key: string;
  label: string;
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
}
export const number = (settings: Settings, key: string) => settings[key] as number;
export const flag = (settings: Settings, key: string) => settings[key] as boolean;
