import { RenderableInline } from '../render/renderable.inline';
import Rule from './rule';

export default interface Decorator<Result extends RenderableInline>
  extends Rule<RenderableInline, Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyDecorator = Decorator<RenderableInline>;
