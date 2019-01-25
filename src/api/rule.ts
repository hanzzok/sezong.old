import { Message } from '../core';
import {
  Configuration,
  Renderable,
  RenderableBlock,
  RenderableInline
} from './';

export interface Rule<
  RequiredInput,
  ExtraConfiguration,
  Result extends Renderable
> {
  readonly namespace: string;
  readonly name: string;

  compile(
    requiredInput: RequiredInput,
    optionalInput: ExtraConfiguration | undefined,
    messages: Message[]
  ): Result | Message;
}

export interface BlockConstructor<Result extends RenderableBlock>
  extends Rule<
    string,
    {
      configuration: Configuration | undefined;
      document: string | undefined;
    },
    Result
  > {
  receiveDocument: boolean;
}

export interface Decorator<Result extends RenderableInline>
  extends Rule<RenderableInline, string[], Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyBlockConstructor = BlockConstructor<RenderableBlock>;

export type AnyDecorator = Decorator<RenderableInline>;
