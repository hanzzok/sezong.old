import { Platform } from '../api';
import { Message } from '../core';
import CompileFunction from './compile-function';
import { Renderable } from './renderable';
import { Rule } from './rule';

export interface Renderer<T, RenderTarget extends Renderable<T>, MidResult> {
  readonly platform: Platform<any, MidResult>;
  readonly target: Rule<any, any, T, RenderTarget>;

  render(
    props: T,
    compile: CompileFunction<MidResult>
  ): [MidResult, Message[]] | Exclude<MidResult, any[]>;
}

export type AnyRenderer = Renderer<{}, Renderable<{}>, any>;
