import {
  BlockConstructorData,
  DecoratorData,
  Node,
  NodeType
} from '../../api/node';
import { Platform } from '../../api/render/platform';
import Renderable from '../../api/render/renderable';
import { RenderableInline } from '../../api/render/renderable.inline';
import { NormalText } from '../../api/render/renderable.normalText';
import { ParagraphSplitBlock } from '../../api/render/renderable.paragraphSplit';
import CompilerConfiguration from '../compiler.configuration';

export function link(
  configuration: CompilerConfiguration,
  nodes: Node[]
): Renderable[] {
  return nodes.map(node => {
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
            it.name === data.name || `${it.namespace}:${it.name}` === data.name
        );
        if (rule) {
          return rule.compile(data.requiredInput, data.optionalInput);
        } else {
          return new NormalText(node.tokens.map(it => it.source).join(''));
        }
      }
      case NodeType.Decorator: {
        const data = node.data as DecoratorData;
        let result: RenderableInline = new NormalText(data.input);

        for (const fun of data.functions) {
          const rule = configuration.decorators.find(
            it =>
              it.name === fun.name || `${it.namespace}:${it.name}` === fun.name
          );
          if (rule && !(result.isEmpty && rule.reduceIfTextEmpty)) {
            result = rule.compile(result, fun.parameters);
          }
        }

        return result;
      }
    }
  });
}

export function render<T>(platform: Platform<T>, renderables: Renderable[]): T {
  return platform.compose(
    renderables.map(renderable => {
      return platform.render(renderable);
    })
  );
}
