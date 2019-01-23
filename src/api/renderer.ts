import { Platform, Renderable } from './';

export interface Renderer<RenderTarget extends Renderable, Result> {
  readonly platform: Platform<Result>;

  canRender(target: Renderable): boolean;
  render(target: RenderTarget): Result;
}
