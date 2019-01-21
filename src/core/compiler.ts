import { Node } from '../api/node';
import { Platform } from '../api/platform';
import {
  Renderable,
  RenderableBlock,
  RenderableInline
} from '../api/renderable';
import { Renderer } from '../api/renderer';
import {
  AnyBlockConstructor,
  AnyDecorator,
  BlockConstructor,
  Decorator
} from '../api/rule';
import { Token } from '../api/token';
import CompilerConfiguration from './compiler-configuration';
import { link, render } from './link/linker';
import { Message } from './message';
import { Parser } from './parse/parser';
import tokenize from './tokenize/tokenizer';

export default class Compiler<ResultType> {
  private modified = false;
  private decorators = new Set<AnyDecorator>();
  private blockConstructors = new Set<AnyBlockConstructor>();
  private configuration: CompilerConfiguration = new CompilerConfiguration(
    [...this.decorators],
    [...this.blockConstructors]
  );

  constructor(private readonly platform: Platform<ResultType>) {}

  public addDecorator<RenderableType extends RenderableInline>(
    rule: Decorator<RenderableType>,
    renderer: Renderer<RenderableType, ResultType>
  ) {
    this.decorators.add(rule);
    this.platform.renderers.add(renderer);
    this.modified = true;
  }

  public addBlockConstructor<RenderableType extends RenderableBlock>(
    rule: BlockConstructor<RenderableType>,
    renderer: Renderer<RenderableType, ResultType>
  ) {
    this.blockConstructors.add(rule);
    this.platform.renderers.add(renderer);
    this.modified = true;
  }

  public tokenize(source: string | TemplateStringsArray): Token[] {
    return tokenize(source);
  }

  public parse(tokens: Token[]): [Node[], Message[]] {
    const parser = new Parser(this.updateConfiguration(), tokens);
    return [parser.parse(), parser.state.messages];
  }

  public link(nodes: Node[]): Renderable[] {
    return link(this.updateConfiguration(), nodes);
  }

  public render(renderables: Renderable[]) {
    return render(this.platform, renderables);
  }

  private updateConfiguration(): CompilerConfiguration {
    if (!this.modified) {
      return this.configuration;
    }
    this.modified = false;
    return (this.configuration = new CompilerConfiguration(
      [...this.decorators],
      [...this.blockConstructors]
    ));
  }
}
