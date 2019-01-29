import { Message, Node, Token } from '../../core';

export type Result = Node | null | Message;
export type AssertResult = Token[] | Result;
export type TokenCondition = (current: Token) => boolean;
