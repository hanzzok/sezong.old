import { Node, Token } from '../../core';

export type Result = Node | null;
export type AssertResult = Token[] | Result;
export type TokenCondition = (current: Token) => boolean;
