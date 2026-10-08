import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Gallery from './gallery-page';
import SketchPage from './sketch-page';
import { catalog } from './catalog';
vi.mock('./sketches/canvas-host', () => ({ CanvasHost: () => null }));

describe('the public collection', () => {
  it('defines all 15 presets with unique routes and distinct Times Tables entries', () => {
    expect(catalog).toHaveLength(15);
    expect(new Set(catalog.map(study => study.slug)).size).toBe(15);
    expect(catalog.filter(study => study.slug.startsWith('times-tables')).map(study => study.slug)).toEqual(['times-tables-animated', 'times-tables-static']);
    expect(catalog.some(study => study.slug === 'bouncy-dvd')).toBe(true);
  });
  it('lets a visitor filter and recover an empty search', () => {
    render(<MemoryRouter><Gallery /></MemoryRouter>);
    expect(screen.getAllByRole('link')).toHaveLength(15);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(screen.getAllByRole('link')).toHaveLength(2);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'not a study' } });
    expect(screen.getByRole('heading', { name: 'No sketches found.' })).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getAllByRole('link')).toHaveLength(15);
  });
  it('offers useful navigation for an unknown study', () => {
    render(<MemoryRouter><SketchPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Page not found' })).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Gallery' }).getAttribute('href')).toBe('/gallery');
  });
});
