import Renderable from '../render/renderable';

export default interface Rule<OptionalInput, Result extends Renderable> {
  readonly namespace: string;
  readonly name: string;

  compile(requiredInput: string, optionalInput: OptionalInput): Result;
}
