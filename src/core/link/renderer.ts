import { Platform } from '../../api';
import { Renderable } from '../../api/renderable';
import { Message } from '../message';

export function render<T>(
  platform: Platform<T, unknown>,
  renderables: Array<Renderable<unknown>>,
  compile: (source: string) => [Array<Renderable<unknown>>, Message[]]
): [T[], Message[]] {
  const results: T[] = [];
  const messages: Message[] = [];
  for (const renderable of renderables) {
    const [result, renderMessages] = platform.render(renderable, compile);
    results.push(result);
    messages.push(...renderMessages);
  }
  return [results, messages];
}

export function renderAll<ResultType>(
  platform: Platform<any, ResultType>,
  renderables: Array<Renderable<unknown>>,
  compile: (source: string) => [Array<Renderable<unknown>>, Message[]]
): [ResultType, Message[]] {
  const [results, messages] = render(platform, renderables, compile);
  return [platform.compose(results), messages];
}
