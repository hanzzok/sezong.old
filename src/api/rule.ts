import { Message } from '../core';
import { Token } from '../core/tokenize/token';
import { Configuration } from './configuration-store';
import { Renderable, RenderableBlock, RenderableInline } from './renderable';

export interface Rule<PrimaryInput, ExtraConfiguration, T> {
  readonly namespace: string;
  readonly name: string;

  compile(
    primaryInput: [PrimaryInput, Token[]],
    extraConfiguration: ExtraConfiguration,
    messages: Message[],
    wholeTokens: Token[]
  ): Renderable<T> | Message;
}

export interface BlockConstructor<T>
  extends Rule<
    string,
    {
      configuration: Configuration | undefined;
      document: [string, Token[]] | undefined;
    },
    T
  > {
  compile(
    primaryInput: [string, Token[]],
    extraConfiguration: {
      configuration: Configuration | undefined;
      document: [string, Token[]] | undefined;
    },
    messages: Message[],
    wholeTokens: Token[]
  ): RenderableBlock<T> | Message;
}

export interface Decorator<T>
  extends Rule<RenderableInline<unknown>, [string, Token[]] | undefined, T> {
  readonly reduceIfTextEmpty?: false | null;

  compile(
    primaryInput: [RenderableInline<unknown>, Token[]],
    extraConfiguration: [string, Token[]] | undefined,
    messages: Message[],
    wholeTokens: Token[]
  ): RenderableInline<T> | Message;
}

export type AnyRule = Rule<unknown, unknown, unknown>;

export type AnyBlockConstructor = BlockConstructor<unknown>;

export type AnyDecorator = Decorator<unknown>;
