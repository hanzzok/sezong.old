import { Message } from '../../../core';
import { CompileFunction } from '../../compile-function';
import { Platform } from '../../platform';
import { Renderable } from '../../renderable';
import { Renderer } from '../../renderer';
import { Rule } from '../../rule';

export function defineRenderer<MidResult, T>(
  platform: Platform<any, MidResult>,
  target: Rule<any, any, T, Renderable<T>>,
  render: (
    props: T,
    compile: CompileFunction<MidResult>
  ) => [MidResult, Message[]] | Exclude<MidResult, any[]>
): Renderer<T, Renderable<T>, MidResult> {
  return {
    platform,
    render,
    target
  };
}
