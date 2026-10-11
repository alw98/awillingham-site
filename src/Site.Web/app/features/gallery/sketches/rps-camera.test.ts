import { describe, expect, it } from 'vitest';
import { RpsCamera } from './rps-camera';

describe('automaton camera', () => {
  it('keeps the cell under the pointer fixed while zooming', () => {
    const camera = new RpsCamera(1024); camera.size = { width: 1280, height: 800 };
    const cursor = { x: 800, y: 300 }, cell = camera.world(cursor);
    camera.zoomAt(4, cursor);
    expect(camera.world(cursor).x).toBeCloseTo(cell.x);
    expect(camera.world(cursor).y).toBeCloseTo(cell.y);
    camera.zoomAt(.25, cursor);
    expect(camera.center).toEqual({ x: 512, y: 512 });
  });
  it('pans in screen pixels at the current zoom and retains the view through resize', () => {
    const camera = new RpsCamera(1024); camera.zoomAt(4);
    const before = camera.world({ x: 160, y: 160 });
    camera.pan({ x: 40, y: -20 });
    expect(camera.center.x).toBeCloseTo(before.x - 40 / camera.scale);
    expect(camera.center.y).toBeCloseTo(before.y + 20 / camera.scale);
    const center = { ...camera.center }; camera.size = { width: 800, height: 500 };
    expect(camera.world({ x: 400, y: 250 })).toEqual(center);
  });
  it('bounds zoom and pan, then resets without changing the simulation grid', () => {
    const camera = new RpsCamera(1024); camera.zoomAt(1e6);
    expect(camera.zoom).toBe(32); camera.zoomAt(1e-12); expect(camera.zoom).toBe(.25);
    camera.pan({ x: -1e9, y: 1e9 }); expect(camera.center).toEqual({ x: 1024, y: 0 });
    camera.reset(); expect(camera.zoom).toBe(1); expect(camera.center).toEqual({ x: 512, y: 512 });
    expect(camera.cells).toBe(1024);
  });
});
