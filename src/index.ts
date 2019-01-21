import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { BlockConstructorData, DecoratorData } from './api/node';
import Compiler from './core/compiler';
import { MessageType } from './core/message';
import { CodeRule } from './std/block-constructor/code.rule';
import { Header1Rule } from './std/block-constructor/header1.rule';
import { YoutubeRule } from './std/block-constructor/youtube.rule';
import { BoldRule } from './std/decorator/bold.rule';
import { LinkRule } from './std/decorator/link.rule';
import { CodeRenderer } from './std/renderer/block-constructor/code.renderer';
import { Header1Renderer } from './std/renderer/block-constructor/header1.renderer';
import { YoutubeRenderer } from './std/renderer/block-constructor/youtube.renderer';
import { BoldRenderer } from './std/renderer/decorator/bold.renderer';
import { LinkRenderer } from './std/renderer/decorator/link.renderer';
import { HtmlPlatform } from './std/renderer/html-platform';

const source = `
# Introduction { anchor = Title }

| youtube vU3oF90WKpw

[Programmatic 'bold] Markup Language

You can go to the [Naver 'link(https://naver.com)] page.

| code js {
  const RanolP     = createUser('RanolP');
  const finalchild = createUser('finalchild');
  const Danuel     = createUser('Danuel'),
        kmc7468    = createUser('static');
}
`;

const sourceLines = source.split('\n');

const compiler = new Compiler(HtmlPlatform);

compiler.addDecorator(BoldRule, BoldRenderer);
// compiler.addDecorator(ItalicRule, ItalicRenderer);
compiler.addDecorator(LinkRule, LinkRenderer);
// compiler.addDecorator(StrikethroughRule, StrikethroughRenderer);
// compiler.addDecorator(UnderlineRule, UnderlineRenderer);

compiler.addBlockConstructor(Header1Rule, Header1Renderer);
compiler.addBlockConstructor(YoutubeRule, YoutubeRenderer);
compiler.addBlockConstructor(CodeRule, CodeRenderer);

const tokens = compiler.tokenize(source);

const [nodes, messages] = compiler.parse(tokens);

for (const message of messages) {
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
        const input = data.optionalInput;
        if (typeof input === 'string') {
          console.log(
            `  |-- ${chalk
              .cyan(input)
              .split('\n')
              .join('\n  |--')}`
          );
        } else {
          for (const key of Object.keys(input)) {
            console.log(
              `  |-- ${chalk.cyan(key)} : ${chalk.cyan((input as any)[key])}`
            );
          }
        }
      }
    }
  }
}

const renderables = compiler.link(nodes);

for (const renderable of renderables) {
  console.log(renderable.debug());
}

const rendered = compiler.render(renderables);
console.log(rendered);
writeFileSync('result.html', rendered);
