import { Platform } from './platform';
import Renderable from './renderable';

export interface Renderer<RenderTarget extends Renderable, Result> {
  readonly platform: Platform<Result>;

  render(target: RenderTarget): Result;
}
