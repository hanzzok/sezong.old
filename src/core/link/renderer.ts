import { Platform } from '../../api';
import { Renderable } from '../../api/renderable';
import { Message } from '../message';

export function render<T>(
  platform: Platform<any, T>,
  renderables: Array<Renderable<any>>,
  compile: (source: string) => [Array<Renderable<any>>, Message[]]
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

export function renderAll<T>(
  platform: Platform<T, any>,
  renderables: Array<Renderable<any>>,
  compile: (source: string) => [Array<Renderable<any>>, Message[]]
): [T, Message[]] {
  const [results, messages] = render(platform, renderables, compile);
  return [platform.compose(results), messages];
}
