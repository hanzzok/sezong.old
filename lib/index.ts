import chalk from 'chalk';
import { BlockConstructorData, DecoratorData } from './api/node';
import parse from './parse/parser';
import tokenize from './parse/tokenizer';
import { Header1Rule } from './std/blockConstructor/header1.rule';
import { YoutubeRule } from './std/blockConstructor/youtube.rule';
import { BoldRule } from './std/decorator/bold.rule';

const decorators = [BoldRule];
const blockConstructors = [Header1Rule, YoutubeRule];

const tokens = tokenize`
# Sezong

[Programmatic 'bold] Markup Language

[Naver 'link(https://naver.com/)]

| youtube 7bB3JXHeDR0
`;

console.table(tokens);

const nodes = parse(decorators, blockConstructors, tokens);

for (const node of nodes) {
  console.log(
    `${chalk.greenBright(node.type)}(${chalk.yellow(
      '' + node.line
    )}:${chalk.yellow('' + node.column)})`
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
        `  ${chalk.cyanBright(data.input)} -> ${data.functions.map(
          it =>
            it.name +
            (it.arguments.length > 0 ? `(${it.arguments.join(', ')})` : '')
        )}`
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
