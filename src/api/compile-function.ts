import { Renderable } from '.';
import { Message } from '..';

export interface CompileFunction<MidResult> {
  (source: string | Renderable<any>): {
    result: MidResult[];
    messages: Message[];
  };
  (source: string, raw: true): MidResult;
}
