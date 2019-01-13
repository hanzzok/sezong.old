import RenderableBlock from '../render/renderable.block';
import Rule from './rule';

export default interface BlockConstructor<
  OptionalInput,
  Result extends RenderableBlock
> extends Rule<OptionalInput, Result> {}

export type AnyBlockConstructor = BlockConstructor<any, RenderableBlock>;
