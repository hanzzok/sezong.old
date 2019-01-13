import chalk from 'chalk';
import { BlockConstructorData, DecoratorData } from './api/node';
import { MessageType } from './core/message';
import { Parser } from './core/parse/parser';
import tokenize from './core/tokenize/tokenizer';
import { Header1Rule } from './std/blockConstructor/header1.rule';
import { YoutubeRule } from './std/blockConstructor/youtube.rule';
import { BoldRule } from './std/decorator/bold.rule';
import { ItalicRule } from './std/decorator/italic.rule';
import { LinkRule } from './std/decorator/link.rule';
import { StrikethroughRule } from './std/decorator/strikethrough.rule';
import { UnderlineRule } from './std/decorator/underline.rule';

const decorators = [
  BoldRule,
  ItalicRule,
  LinkRule,
  StrikethroughRule,
  UnderlineRule
];
const blockConstructors = [Header1Rule, YoutubeRule];

const source = `
[Programmatic 'bold] Markup Language

You can go to the [Naver 'link(https://naver.com)] page.

[Mixed Styles 'bold 'italic 'link(https://google.com) 'underline]
`;

const sourceLines = source.split('\n');

const tokens = tokenize(source);

const parser = new Parser(decorators, blockConstructors, tokens);
const nodes = parser.parse();

for (const message of parser.messages) {
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
    `  tokens: [${node.tokens
      .map(it =>
        chalk.cyanBright(it.source.replace('\n', '\\n').replace('\r', '\\r'))
      )
      .join(', ')}]`
  );
  if (node.data) {
    if ('input' in node.data && 'functions' in node.data) {
      const data = node.data as DecoratorData;
      console.log(
        `  ${chalk.cyanBright(data.input)} -> ${data.functions
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
        `  | ${chalk.cyanBright(data.name)}(${chalk.cyanBright(
          data.requiredInput
        )})`
      );
    }
  }
}
