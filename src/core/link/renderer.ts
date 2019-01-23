import { Platform, Renderable } from '../../api';

export default function render<T>(
  platform: Platform<T>,
  renderables: Renderable[]
): T {
  return platform.compose(
    renderables.map(renderable => {
      return platform.render(renderable);
    })
  );
}
