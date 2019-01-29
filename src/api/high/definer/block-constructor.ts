import { BlockConstructor, RenderableBlock } from '../../../api';
import { Message, MessageType } from '../../../core';
import { asJsObject } from '../../configuration-store';
import { createExtractor } from '../props';
import { OutputOf, Props } from '../props/types';
import {
  RedundantCondition,
  RequireCondition,
  RequiredCondition,
  RequireType
} from '../require-type';

export interface BlockConstructorContext {
  primaryInput?: string;
  document?: string;
}

export type BlockConstructorConfiguration<
  T extends Props<BlockConstructorContext>
> = [RequireCondition, T];

export interface BlockConstructorArgument<
  T extends Props<BlockConstructorContext>
> {
  configuration: BlockConstructorConfiguration<T>;
  document: RequireCondition;
  name: string;
  namespace: string;
  primaryInput: RequireCondition;
}

export type BlockConstructorProps<
  T extends BlockConstructorArgument<P>,
  P extends Props<BlockConstructorContext>
> = {
  props: OutputOf<P>;
} & (T['primaryInput'] extends RedundantCondition
  ? {}
  : T['primaryInput'] extends RequiredCondition
  ? { primaryInput: string }
  : { primaryInput?: string }) &
  (T['document'] extends RedundantCondition
    ? {}
    : T['document'] extends RequiredCondition
    ? { document: string }
    : { document?: string });

export function defineBlockConstructor<
  T extends BlockConstructorArgument<P>,
  P extends Props<BlockConstructorContext>
>(
  argument: T
): BlockConstructor<
  BlockConstructorProps<T, P>,
  RenderableBlock<BlockConstructorProps<T, P>>
> {
  class RenderableType extends RenderableBlock<BlockConstructorProps<T, P>> {
    constructor(props: NonNullable<BlockConstructorProps<T, P>>) {
      super(argument.namespace, argument.name, props);
    }
  }

  const Rule: BlockConstructor<
    BlockConstructorProps<T, P>,
    RenderableBlock<BlockConstructorProps<T, P>>
  > = {
    compile: (
      [primaryInput, primaryInputTokens],
      { configuration, document },
      messages,
      wholeTokens
    ) => {
      if (
        argument.primaryInput.type === RequireType.Required &&
        primaryInput.trim().length === 0
      ) {
        const first = primaryInputTokens[0].pos;
        const last = primaryInputTokens.slice(-1)[0];
        return new Message(
          MessageType.Error,
          argument.primaryInput.message ||
            `Rule '${argument.namespace}:${
              argument.name
            }' requires primary input`,
          first.line,
          first.real,
          last.pos.real + last.length
        );
      }

      if (
        argument.primaryInput.type === RequireType.Redundant &&
        primaryInput.trim().length !== 0
      ) {
        const first = primaryInputTokens[0].pos;
        const last = primaryInputTokens.slice(-1)[0];
        messages.push(
          new Message(
            MessageType.Warning,
            argument.primaryInput.message ||
              `The primary input of Rule '${argument.namespace}:${
                argument.name
              }' is redundant`,
            first.line,
            first.real,
            last.pos.real + last.length
          )
        );
      }

      if (
        argument.document.type === RequireType.Required &&
        (!document || document[0].trim().length === 0)
      ) {
        const first = wholeTokens[0].pos;
        const last = wholeTokens.slice(-1)[0];
        return new Message(
          MessageType.Error,
          argument.primaryInput.message ||
            `Rule '${argument.namespace}:${argument.name}' requires document`,
          first.line,
          first.real,
          last.pos.real + last.length
        );
      }

      if (
        argument.primaryInput.type === RequireType.Redundant &&
        document &&
        document[0].trim().length !== 0
      ) {
        const first = document[1][0].pos;
        const last = document[1].slice(-1)[0];
        messages.push(
          new Message(
            MessageType.Warning,
            argument.primaryInput.message ||
              `The document of Rule '${argument.namespace}:${
                argument.name
              }' is redundant`,
            first.line,
            first.real,
            last.pos.real + last.length
          )
        );
      }

      const extract = createExtractor(
        {
          document: document && document[0],
          primaryInput
        },
        argument.configuration[1],
        key => {
          if (configuration) {
            const first = configuration[key].keyTokens[0].pos;
            const last = configuration[key].keyTokens.slice(-1)[0];
            messages.push(
              new Message(
                MessageType.Informal,
                `Key '${key}' is unused key in rule '${argument.namespace}:${
                  argument.name
                }'`,
                first.line,
                first.column,
                last.pos.real + last.length
              )
            );
          }
        }
      );

      const [props, extractMessages] = extract(asJsObject(configuration));

      if (configuration) {
        for (const extractMessage of extractMessages) {
          const first = configuration[extractMessage.key].keyTokens[0].pos;
          const last = configuration[extractMessage.key].keyTokens.slice(-1)[0];

          const [start, end] = extractMessage.range
            ? [
                first.column + extractMessage.range.from,
                first.column + extractMessage.range.to
              ]
            : [first.column, last.pos.column + last.length];
          messages.push(
            new Message(
              extractMessage.type,
              extractMessage.message,
              first.line,
              start,
              end
            )
          );
        }
      }

      return new RenderableType(({
        document:
          argument.document.type === RequireType.Redundant
            ? undefined
            : document && document[0],
        primaryInput:
          argument.primaryInput.type === RequireType.Redundant
            ? undefined
            : primaryInput,
        props
      } as any) as NonNullable<BlockConstructorProps<T, P>>);
    },
    name: argument.name,
    namespace: argument.namespace
  };

  return Rule;
}
