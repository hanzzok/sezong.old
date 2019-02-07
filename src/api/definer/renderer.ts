import { Platform } from '../../api';
import { Message } from '../../core';
import CompileFunction from '../compile-function';
import { Renderer } from '../renderer';
import { Rule } from '../rule';

export function defineRenderer<MidResult, Result, T>(
  platform: Platform<MidResult, Result>,
  target: Rule<unknown, unknown, T>,
  render: (
    props: T,
    compile: CompileFunction<MidResult>
  ) => [MidResult, Message[]] | Exclude<MidResult, any[]>
): Renderer<T, MidResult> {
  return {
    platform,
    render,
    target
  };
}
