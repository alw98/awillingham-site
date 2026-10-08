import { useParams } from 'react-router';
import { catalog } from './catalog';
import { definitions } from './sketches/definitions';
import { SketchView } from './sketches/sketch-view';
import NotFound from '../../routes/not-found';
export const meta = ({ params }: { params: Record<string, string | undefined> }) => [{ title: `${catalog.find(study => study.slug === params.slug)?.title ?? 'Study'} — Armond Willingham` }];

export default function SketchPage() {
  const { slug } = useParams();
  const study = definitions.find(entry => entry.slug === slug);
  if (!study) return <NotFound />;
  return <SketchView key={study.slug} definition={study} />;
}
