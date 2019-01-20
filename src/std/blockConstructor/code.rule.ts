import { joinOptionalInput, OptionalInput } from '../../api/optional-input';
import { RenderableBlock } from '../../api/renderable';
import { BlockConstructor } from '../../api/rule';

export const CodeRule: BlockConstructor<CodeBlock> = {
  compile(requiredInput: string, source: OptionalInput): CodeBlock {
    return new CodeBlock(requiredInput, joinOptionalInput(source));
  },
  name: 'code',
  namespace: 'std'
};

export class CodeBlock implements RenderableBlock {
  constructor(
    public readonly language: string,
    public readonly source: string
  ) {}

  public debug(): string {
    return `Code(${this.language}, ${this.source})`;
  }
}
