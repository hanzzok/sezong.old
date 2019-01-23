import { CompilerConfiguration, MessageType, Parser, tokenize } from '../src';
import { NodeType } from '../src/api';

const configuration = new CompilerConfiguration([], []);

const createParser = (source: string) =>
  new Parser(configuration, tokenize(source));

describe('decorators', () => {
  it('bold', () => {
    const source = "[Text 'bold]";
    const node = createParser(source).nextNode();
    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.Decorator);
  });

  it('unknown', () => {
    const source = "[Text 'unknownDecorator]";
    const parser = createParser(source);
    const node = parser.nextNode();
    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.Decorator);
    expect(parser.state.messages.length).toBe(1);
    expect(parser.state.messages[0].type).toBe(MessageType.Warning);
  });
});
