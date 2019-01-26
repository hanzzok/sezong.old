import { Message } from '../core';
import {
  Configuration,
  Renderable,
  RenderableBlock,
  RenderableInline
} from './';

export interface Rule<
  PrimaryInput,
  ExtraConfiguration,
  Result extends Renderable
> {
  readonly namespace: string;
  readonly name: string;

  compile(
    requiredInput: PrimaryInput,
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
  > {}

export interface Decorator<Result extends RenderableInline>
  extends Rule<RenderableInline, string[], Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyBlockConstructor = BlockConstructor<RenderableBlock>;

export type AnyDecorator = Decorator<RenderableInline>;
