import { Message } from '..';
import { Renderable } from './renderable';

export default interface CompileFunction<MidResult> {
  (source: string | Renderable<any>): {
    result: MidResult[];
    messages: Message[];
  };
  (source: string, raw: true): MidResult;
}
