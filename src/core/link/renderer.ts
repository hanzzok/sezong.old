import { Platform, Renderable } from '../../api';

export function render<T>(
  platform: Platform<any, T>,
  renderables: Renderable[]
): T[] {
  return renderables.map(renderable => platform.render(renderable));
}

export function renderAll<T>(
  platform: Platform<T, any>,
  renderables: Renderable[]
): T {
  return platform.compose(render(platform, renderables));
}
