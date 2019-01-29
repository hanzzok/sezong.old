import { Message } from '../core';
import { Platform, Renderable, Rule } from './';
import { CompileFunction } from './compile-function';

export interface Renderer<T, RenderTarget extends Renderable<T>, MidResult> {
  readonly platform: Platform<any, MidResult>;
  readonly target: Rule<any, any, T, RenderTarget>;

  render(
    props: T,
    compile: CompileFunction<MidResult>
  ): [MidResult, Message[]] | Exclude<MidResult, any[]>;
}

export type AnyRenderer = Renderer<{}, Renderable<{}>, any>;
