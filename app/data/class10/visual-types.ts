import type { L } from '../lesson-content';

export type VisualNode = {
  id: string;
  label: L;
  value?: L;
  x: number;
  y: number;
  shape?: 'card' | 'circle' | 'box';
};
export type VisualEdge = { id: string; from: string; to: string; label?: L };
export type VisualStep = {
  label: L;
  description: L;
  active: string[];
  warning?: string[];
  complete?: string[];
  hidden?: string[];
  moves?: { id: string; x: number; y: number }[];
  values?: Record<string, L>;
  activeEdges?: string[];
};
export type VisualScene = {
  steps: [VisualStep, VisualStep, VisualStep] | [VisualStep, VisualStep, VisualStep, VisualStep];
};
export type ChapterVisual = {
  layout: 'flow' | 'records' | 'trace' | 'grid' | 'compare' | 'timeline';
  nodes: VisualNode[];
  edges: VisualEdge[];
  scenes: [VisualScene, VisualScene, VisualScene, VisualScene, VisualScene, VisualScene];
  exploration: {
    title: L;
    prompt: L;
    variants: { id: string; label: L; scene: number; step: number }[];
  };
};
