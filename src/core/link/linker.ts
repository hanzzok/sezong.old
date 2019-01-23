import {
  BlockConstructorData,
  DecoratorData,
  Node,
  NodeType
} from '../../api/node';
import { Platform } from '../../api/platform';
import {
  NormalText,
  ParagraphSplitBlock,
  Renderable,
  RenderableInline
} from '../../api/renderable';
import CompilerConfiguration from '../compiler-configuration';
import { Message } from '../message';

export function link(
  configuration: CompilerConfiguration,
  nodes: Node[]
): [Renderable[], Message[]] {
  const messages: Message[] = [];
  return [
    nodes
      .map(node => {
        switch (node.type) {
          case NodeType.ParagraphSplit: {
            return ParagraphSplitBlock.instance;
          }
          case NodeType.NormalText: {
            return new NormalText(node.tokens.map(it => it.source).join(''));
          }
          case NodeType.BlockConstructor: {
            const data = node.data as BlockConstructorData;
            const rule = configuration.blockConstructors.find(
              it =>
                it.name === data.name ||
                `${it.namespace}:${it.name}` === data.name
            );
            if (rule) {
              return rule.compile(
                data.requiredInput,
                data.optionalInput,
                messages
              );
            } else {
              return new NormalText(node.tokens.map(it => it.source).join(''));
            }
          }
          case NodeType.Decorator: {
            const data = node.data as DecoratorData;
            let value: RenderableInline = new NormalText(data.input);

            for (const fun of data.functions) {
              const rule = configuration.decorators.find(
                it =>
                  it.name === fun.name ||
                  `${it.namespace}:${it.name}` === fun.name
              );
              if (rule && !(value.isEmpty && rule.reduceIfTextEmpty)) {
                const result = rule.compile(value, fun.parameters, messages);
                if (result instanceof Message) {
                  return result;
                }
                value = result;
              }
            }

            return value;
          }
        }
      })
      .filter(it => {
        if (it instanceof Message) {
          messages.push(it);
          return false;
        } else {
          return true;
        }
      }) as Renderable[],
    messages
  ];
}

export function render<T>(platform: Platform<T>, renderables: Renderable[]): T {
  return platform.compose(
    renderables.map(renderable => {
      return platform.render(renderable);
    })
  );
}
