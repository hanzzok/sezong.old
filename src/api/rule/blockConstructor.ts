import { RenderableBlock } from '../render/renderable.block';
import Rule from './rule';

export default interface BlockConstructor<Result extends RenderableBlock>
  extends Rule<string, Result> {}

export type AnyBlockConstructor = BlockConstructor<RenderableBlock>;
