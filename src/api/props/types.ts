import { PropDefault, PropNullable } from './base';

export type ValidProp<C, T> = PropDefault<C, T> | PropNullable<C, T>;

export type Props<C> = Record<string, ValidProp<C, any>>;

export type InputOf<T extends Props<any>> = { [K in keyof T]?: string };

export type OutputOf<T extends Props<any>> = { [K in keyof T]: T[K]['T'] };
