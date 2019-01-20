import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { BlockConstructorData, DecoratorData } from './api/node';
import CompilerConfiguration from './core/compiler.configuration';
import { link, render } from './core/link/linker';
import { MessageType } from './core/message';
import { Parser } from './core/parse/parser';
import tokenize from './core/tokenize/tokenizer';
import { CodeRule } from './std/blockConstructor/code.rule';
import { Header1Rule } from './std/blockConstructor/header1.rule';
import { YoutubeRule } from './std/blockConstructor/youtube.rule';
import { BoldRule } from './std/decorator/bold.rule';
import { ItalicRule } from './std/decorator/italic.rule';
import { LinkRule } from './std/decorator/link.rule';
import { StrikethroughRule } from './std/decorator/strikethrough.rule';
import { UnderlineRule } from './std/decorator/underline.rule';
import { CodeRenderer } from './std/renderer/blockConstructor/code.renderer';
import { Header1Renderer } from './std/renderer/blockConstructor/header1.renderer';
import { YoutubeRenderer } from './std/renderer/blockConstructor/youtube.renderer';
import { BoldRenderer } from './std/renderer/decorator/bold.renderer';
import { LinkRenderer } from './std/renderer/decorator/link.renderer';
import { HtmlPlatform } from './std/renderer/htmlPlatform';
import { NormalTextRenderer } from './std/renderer/normalText.renderer';
import { ParagraphSplitRenderer } from './std/renderer/paragraphSplit.renderer';

const decorators = [
  BoldRule,
  ItalicRule,
  LinkRule,
  StrikethroughRule,
  UnderlineRule
];
const blockConstructors = [Header1Rule, YoutubeRule, CodeRule];

const source = `
# Introduction { anchor = Title }

| youtube vU3oF90WKpw

[Programmatic 'bold] Markup Language

You can go to the [Naver 'link(https://naver.com)] page.

| code js {
import twitter from 'my-twitter-lib';

const finalchild \= twitter.getUser('@finalchildmc');

console.log(\`Hello, \${finalchild\\}!\`);
}
`;

const sourceLines = source.split('\n');

const tokens = tokenize(source);

const configuration = new CompilerConfiguration(decorators, blockConstructors);
const parser = new Parser(configuration.parserConfiguration, tokens);
const nodes = parser.parse();

for (const message of parser.state.messages) {
  let prefix: string = '   [?] ';
  let colorizer = chalk.reset;
  switch (message.type) {
    case MessageType.Informal: {
      prefix = ' ' + chalk.bgBlue(' info ');
      colorizer = chalk.blue;
      break;
    }
    case MessageType.Warning: {
      prefix = ' ' + chalk.black(chalk.bgYellow(' warn '));
      colorizer = chalk.yellow;
      break;
    }
    case MessageType.Error: {
      prefix = chalk.black(chalk.bgRed(' error '));
      colorizer = chalk.red;
      break;
    }
  }
  console.log(` ${prefix} ${message.text}`);
  console.log(
    chalk.gray(`${message.from.pos.line} | `.padStart(9)) +
      sourceLines[message.from.pos.line - 1].substring(
        0,
        message.from.pos.column
      ) +
      colorizer(
        sourceLines[message.from.pos.line - 1].substring(
          message.from.pos.column,
          message.to.pos.column + message.to.length
        )
      ) +
      sourceLines[message.from.pos.line - 1].substring(
        message.to.pos.column + message.to.length
      )
  );
  console.log(
    ''.padStart(message.from.pos.column + 9, ' ') +
      colorizer(
        ''.padStart(
          message.to.pos.real + message.to.length - message.from.pos.real,
          '^'
        )
      )
  );
}

for (const node of nodes) {
  console.log(
    `${chalk.greenBright(node.type)}(${chalk.yellow(
      '' + node.pos.line
    )}:${chalk.yellow('' + node.pos.column)})`
  );
  console.log(
    `  source: '${node.tokens
      .map(it =>
        chalk.cyan(it.source.replace('\n', '\\n').replace('\r', '\\r'))
      )
      .join('')}'`
  );
  if (node.data) {
    if ('input' in node.data && 'functions' in node.data) {
      const data = node.data as DecoratorData;
      console.log(
        `  ${chalk.cyan(data.input)} -> ${data.functions
          .map(
            it =>
              it.name +
              (it.parameters.length > 0 ? `(${it.parameters.join(', ')})` : '')
          )
          .join(' -> ')}`
      );
    } else if ('name' in node.data && 'requiredInput' in node.data) {
      const data = node.data as BlockConstructorData;
      console.log(
        `  | ${chalk.cyan(data.name)}(${chalk.cyan(data.requiredInput)})`
      );
      if (data.optionalInput) {
        for (const input of data.optionalInput) {
          if (typeof input === 'string') {
            console.log(
              `  \\-- ${chalk
                .cyan(input)
                .split('\n')
                .join('\n  |--')}`
            );
          } else {
            const [key, value] = input;
            console.log(`  \\-- ${chalk.cyan(key)} : ${chalk.cyan(value)}`);
          }
        }
      }
    }
  }
}

const renderables = link(configuration, nodes);

for (const renderable of renderables) {
  console.log(renderable.debug());
}

HtmlPlatform.renderers.add(ParagraphSplitRenderer);
HtmlPlatform.renderers.add(NormalTextRenderer);

HtmlPlatform.renderers.add(Header1Renderer);
HtmlPlatform.renderers.add(YoutubeRenderer);
HtmlPlatform.renderers.add(CodeRenderer);

HtmlPlatform.renderers.add(BoldRenderer);
HtmlPlatform.renderers.add(LinkRenderer);

const rendered = render(HtmlPlatform, renderables);
console.log(rendered);
writeFileSync('result.html', rendered);
