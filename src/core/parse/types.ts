import { Node } from '../../api/node';
import { Token } from '../../api/token';
import { Message } from '../message';

export type Result = Node | null | Message;
export type AssertResult = Token[] | Result;
export type CurrentTokenCondition = (current: Token) => boolean;
export type PrevCurrentTokenCondition = (
  prev: Token | null,
  current: Token
) => boolean;
export type TokenCondition = CurrentTokenCondition | PrevCurrentTokenCondition;
