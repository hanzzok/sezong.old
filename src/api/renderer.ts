import { Platform } from './platform';
import { Renderable } from './renderable';

export interface Renderer<RenderTarget extends Renderable, Result> {
  readonly platform: Platform<Result>;

  canRender(target: Renderable): boolean;
  render(target: RenderTarget): Result;
}
