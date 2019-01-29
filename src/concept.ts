import { Platform } from './api';
import { defineBlockConstructor } from './api/high/definer/block-constructor';
import { defineDecorator } from './api/high/definer/decorator';
import { defineRenderer } from './api/high/definer/renderer';
import { p } from './api/high/props';
import { optional, redundant, required } from './api/high/require-type';
import { primaryInput } from './api/high/values/primary-input';
import { Compiler } from './core';

const conflicts: string[] = [];

function mangle(str: string): string {
  let mangled = str.replace(/ /g, '-').replace(/[\['\]]/g, '_');
  while (conflicts.includes(mangled)) {
    mangled +=
      '__' +
      Math.random()
        .toFixed(5)
        .substring(2);
  }
  conflicts.push(mangled);
  return mangled;
}

const HtmlPlatform = new Platform<string>(
  'Html',
  it => it.join(''),
  it => it.data,
  _ => '<br/>'
);

export const Header1Rule = defineBlockConstructor({
  configuration: [
    optional(),
    {
      anchor: p.string().default(
        primaryInput()
          .map(mangle)
          .orElse('')
      )
    }
  ],
  document: redundant('You should not insert document on header'),
  name: '#',
  namespace: 'std',
  primaryInput: required('You should insert primary input on header')
});

export const Header1Renderer = defineRenderer(
  HtmlPlatform,
  Header1Rule,
  ({ primaryInput: text, props: { anchor } }, compile) => {
    const { result, messages } = compile(text);
    return [
      `<h1 id="${anchor}">${HtmlPlatform.compose(result)}</h1>`,
      messages
    ];
  }
);

export const BoldRule = defineDecorator({
  name: 'bold',
  namespace: 'std',
  parameter: redundant('Bold rule does not requires any parameter.'),
  primaryInput: required('Bold rule requires input, be ignored.')
});

export const BoldRenderer = defineRenderer(
  HtmlPlatform,
  BoldRule,
  ({ primaryInput: text }, compile) =>
    `<b>${HtmlPlatform.compose(compile(text).result)}</b>`
);

HtmlPlatform.registerBlockConstructor(Header1Renderer);
HtmlPlatform.registerDecorator(BoldRenderer);

const compiler = new Compiler(HtmlPlatform);

console.log(
  compiler.compile(`
# Header 1
# Header 1
# Header 2 { anchor=Header222 }

# Header [3 'bold]

is it [bold text 'bold]?
`)[0]
);
