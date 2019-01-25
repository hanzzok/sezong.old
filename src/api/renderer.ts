import { Platform, Renderable } from './';

export interface Renderer<RenderTarget extends Renderable, MidResult> {
  readonly platform: Platform<any, MidResult>;

  canRender(target: Renderable): boolean;
  render(target: RenderTarget): MidResult;
}

export type AnyRenderer = Renderer<Renderable, any>;
