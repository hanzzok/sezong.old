import {
  AnyBlockConstructor,
  AnyRenderer,
  asJsObject,
  BlockConstructorData,
  NodeType,
  Platform
} from '../../src/api';
import { Compiler } from '../../src/core';

const MockedPlatform = jest.fn<Platform<any, any>>(() => ({
  renderers: new Set()
}));
const MockedBlockConstructor = jest.fn<AnyBlockConstructor>(
  (namespace: string, name: string) => ({
    name,
    namespace
  })
);
const MockedRenderer = jest.fn<AnyRenderer>(() => ({}));
const compiler = new Compiler<any, any>(new MockedPlatform());
compiler.addBlockConstructor(
  new MockedBlockConstructor('test', '#'),
  new MockedRenderer()
);

describe('block constructors', () => {
  it('special without primary input, configuration and document', () => {
    const source = `#`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('');
    expect(data.configuration).toBeUndefined();
    expect(data.document).toBeUndefined();

    expect(messages.length).toBe(0);
  });

  it('special with primary input without configuration and document', () => {
    const source = `# Heading`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('Heading');
    expect(data.configuration).toBeUndefined();
    expect(data.document).toBeUndefined();

    expect(messages.length).toBe(0);
  });

  it('special with primary input and configuration without document', () => {
    const source = `# Heading { anchor = IsOrderHeading }`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('Heading');
    expect(asJsObject(data.configuration)).toEqual({
      anchor: 'IsOrderHeading'
    });
    expect(data.document).toBeUndefined();

    expect(messages.length).toBe(0);
  });

  it('special with primary input and configuration and document', () => {
    const source = `# Heading { anchor = IsOrderHeading } >> Document <<`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('Heading');
    expect(asJsObject(data.configuration)).toEqual({
      anchor: 'IsOrderHeading'
    });
    expect(data.document).toBe(' Document ');

    expect(messages.length).toBe(0);
  });

  it('special with primary input and document without configuration', () => {
    const source = `# Heading >> Document <<`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('Heading');
    expect(data.configuration).toBeUndefined();
    expect(data.document).toBe(' Document ');

    expect(messages.length).toBe(0);
  });

  it('special without primary input and configuration and with document', () => {
    const source = `# >> Document <<`;
    const [[node], messages] = compiler.parse(compiler.tokenize(source));
    const data = node.data as BlockConstructorData;

    expect(node).not.toBe(null);
    expect(node!.type).toBe(NodeType.BlockConstructor);

    expect(data).not.toBe(null);
    expect(data.primaryInput).toBe('');
    expect(data.configuration).toBeUndefined();
    expect(data.document).toBe(' Document ');

    expect(messages.length).toBe(0);
  });
});
