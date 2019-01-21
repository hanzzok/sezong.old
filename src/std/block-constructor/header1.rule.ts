import { RenderableBlock } from '../../api/renderable';
import { BlockConstructor } from '../../api/rule';

export const Header1Rule: BlockConstructor<Header1Block> = {
  compile(requiredInput: string): Header1Block {
    return new Header1Block(requiredInput);
  },
  name: '#',
  namespace: 'std'
};

export class Header1Block implements RenderableBlock {
  public readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  public debug(): string {
    return `Header1(${this.text})`;
  }
}
