import { Platform, Renderable } from '../api';
import {
  CompilerConfiguration,
  link,
  Message,
  Parser,
  render,
  Token,
  tokenize
} from '../core';
import { renderAll } from './link/renderer';
import { Node } from './parse/node';

export default class Compiler<ResultType, MidResultType> {
  private configuration: CompilerConfiguration;

  constructor(private readonly platform: Platform<ResultType, MidResultType>) {
    this.configuration = new CompilerConfiguration(
      [...platform.decorators.values()].map(it => it.target),
      [...platform.blockConstructors.values()].map(it => it.target)
    );
  }

  public tokenize(source: string | TemplateStringsArray): Token[] {
    return tokenize(source);
  }

  public parse(tokens: Token[]): [Node[], Message[]] {
    const parser = new Parser(this.configuration, tokens);
    return [parser.parse(), parser.state.messages];
  }

  public link(nodes: Node[]): [Array<Renderable<any>>, Message[]] {
    return link(this.configuration, nodes);
  }

  public render(
    renderables: Array<Renderable<any>>
  ): [MidResultType[], Message[]] {
    return render(this.platform, renderables, source =>
      this.renderCompileFunction(source)
    );
  }

  public renderAll(
    renderables: Array<Renderable<any>>
  ): [ResultType, Message[]] {
    return renderAll(this.platform, renderables, source =>
      this.renderCompileFunction(source)
    );
  }

  public compile(
    source: string | TemplateStringsArray
  ): [ResultType, Message[]] {
    const tokens = this.tokenize(source);
    const [nodes, parseMessages] = this.parse(tokens);
    const [renderables, linkMessages] = this.link(nodes);
    const [rendered, renderedMessages] = this.renderAll(renderables);

    return [
      rendered,
      parseMessages.concat(linkMessages).concat(renderedMessages)
    ];
  }

  private renderCompileFunction(
    source: string
  ): [Array<Renderable<any>>, Message[]] {
    const tokens = this.tokenize(source);
    const [nodes, parseMessages] = this.parse(tokens);
    const [renderables, linkMessages] = this.link(nodes);
    return [renderables, parseMessages.concat(linkMessages)];
  }
}
