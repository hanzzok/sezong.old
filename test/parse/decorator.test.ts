import { Compiler, MessageType } from '../../src';
import { AnyDecorator, AnyRenderer, NodeType, Platform } from '../../src/api';

const MockedPlatform = jest.fn<Platform<any, any>>(() => ({
  renderers: new Set()
}));
const MockedDecorator = jest.fn<AnyDecorator>(
  (namespace: string, name: string) => ({
    name,
    namespace
  })
);
const MockedRenderer = jest.fn<AnyRenderer>(() => ({}));
const compiler = new Compiler<any, any>(new MockedPlatform());
compiler.addDecorator(
  new MockedDecorator('test', 'known'),
  new MockedRenderer()
);

describe('decorators', () => {
  it('known', () => {
    const source = `[Text 'known]`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.Decorator);
    expect(messages.length).toBe(0);
  });

  it('unknown', () => {
    const source = `[Text 'unknown]`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.Decorator);
    expect(messages.length).toBe(1);
    expect(messages[0].type).toBe(MessageType.Warning);
  });
});
