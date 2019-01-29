import { Compiler, MessageType, NodeType } from '../../src';
import { Platform } from '../../src/api';
import { AnyRenderer } from '../../src/api/renderer';
import { Rule } from '../../src/api/rule';

const MockedPlatform = new Platform('Mocked', jest.fn(), jest.fn(), jest.fn());
const MockedRule = jest.fn<Rule<any, any, any, any>>(
  (namespace: string, name: string) => ({
    name,
    namespace
  })
);
const MockedRenderer = jest.fn<AnyRenderer>(
  (target: Rule<any, any, any, any>) => ({
    platform: MockedPlatform,
    target
  })
);
MockedPlatform.registerDecorator(
  new MockedRenderer(new MockedRule('std', 'known'))
);
const compiler = new Compiler<any, any>(MockedPlatform);

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
