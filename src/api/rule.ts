import { Message } from '../core';
import { Token } from '../core/tokenize/token';
import { Configuration } from './configuration-store';
import { Renderable, RenderableBlock, RenderableInline } from './renderable';

export interface Rule<
  PrimaryInput,
  ExtraConfiguration,
  T,
  Result extends Renderable<T>
> {
  readonly namespace: string;
  readonly name: string;

  compile(
    primaryInput: [PrimaryInput, Token[]],
    extraConfiguration: ExtraConfiguration,
    messages: Message[],
    wholeTokens: Token[]
  ): Result | Message;
}

export interface BlockConstructor<T, Result extends RenderableBlock<T>>
  extends Rule<
    string,
    {
      configuration: Configuration | undefined;
      document: [string, Token[]] | undefined;
    },
    T,
    Result
  > {}

export interface Decorator<T, Result extends RenderableInline<T>>
  extends Rule<RenderableInline<T>, [string, Token[]] | undefined, T, Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyBlockConstructor = BlockConstructor<{}, RenderableBlock<{}>>;

export type AnyDecorator = Decorator<{}, RenderableInline<{}>>;
