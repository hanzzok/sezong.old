import { Message } from '../core/message';
import { BlockOptionalInput } from './optional-input';
import { Renderable, RenderableBlock, RenderableInline } from './renderable';

export interface Rule<RequiredInput, OptionalInput, Result extends Renderable> {
  readonly namespace: string;
  readonly name: string;

  compile(
    requiredInput: RequiredInput,
    optionalInput: OptionalInput,
    messages: Message[]
  ): Result | Message;
}

export interface BlockConstructor<Result extends RenderableBlock>
  extends Rule<string, BlockOptionalInput, Result> {
  receiveDocument: boolean;
}

export interface Decorator<Result extends RenderableInline>
  extends Rule<RenderableInline, string[], Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyBlockConstructor = BlockConstructor<RenderableBlock>;

export type AnyDecorator = Decorator<RenderableInline>;
