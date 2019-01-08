import RenderableText from '../render/renderable.text';
import Rule from './rule';

export default interface Decorator<
  OptionalInput,
  Result extends RenderableText
> extends Rule<OptionalInput, Result> {
  readonly reduceIfTextEmpty?: false | null;
}
