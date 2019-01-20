import { OptionalInput } from './optional-input';
import { Renderable, RenderableBlock, RenderableInline } from './renderable';

export interface Rule<RequiredInput, Result extends Renderable> {
  readonly namespace: string;
  readonly name: string;

  compile(requiredInput: RequiredInput, optionalInput: OptionalInput): Result;
}

export interface BlockConstructor<Result extends RenderableBlock>
  extends Rule<string, Result> {}

export interface Decorator<Result extends RenderableInline>
  extends Rule<RenderableInline, Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyBlockConstructor = BlockConstructor<RenderableBlock>;

export type AnyDecorator = Decorator<RenderableInline>;
