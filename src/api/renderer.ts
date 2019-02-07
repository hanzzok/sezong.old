import { Platform } from '../api';
import { Message } from '../core';
import CompileFunction from './compile-function';
import { Rule } from './rule';

export interface Renderer<T, MidResult> {
  readonly platform: Platform<MidResult, unknown>;
  readonly target: Rule<unknown, unknown, T>;

  render(
    props: T,
    compile: CompileFunction<MidResult>
  ): [MidResult, Message[]] | Exclude<MidResult, any[]>;
}

export type AnyRenderer = Renderer<unknown, unknown>;
