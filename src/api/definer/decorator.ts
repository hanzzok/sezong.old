import { Message, MessageType } from '../../core';
import { RenderableInline, RenderableText } from '../renderable';
import {
  OptionalCondition,
  RedundantCondition,
  RequireCondition,
  RequiredCondition,
  RequireType
} from '../require-type';
import { Decorator } from '../rule';

export interface DecoratorArgument {
  name: string;
  namespace: string;
  parameter: RequireCondition;
  primaryInput: RequiredCondition | RedundantCondition;
}

type OutputOf<
  T extends DecoratorArgument
> = (T['primaryInput'] extends RequiredCondition
  ? { primaryInput: RenderableInline<OutputOf<T>> }
  : {}) &
  (T['parameter'] extends RequiredCondition
    ? { parameter: string }
    : T['parameter'] extends OptionalCondition
    ? { parameter?: string }
    : {});

export function defineDecorator<T extends DecoratorArgument>(
  argument: T
): Decorator<OutputOf<T>, RenderableText<OutputOf<T>>> {
  class RenderableType extends RenderableText<OutputOf<T>> {
    constructor(props: NonNullable<OutputOf<T>>, data: RenderableInline<any>) {
      super(argument.namespace, argument.name, props, data);
    }
  }

  const Rule: Decorator<OutputOf<T>, RenderableText<OutputOf<T>>> = {
    compile: (
      [primaryInput, primaryInputTokens],
      parameter,
      messages,
      wholeTokens
    ) => {
      if (
        argument.primaryInput.type === RequireType.Required &&
        primaryInput.isEmpty
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
        !primaryInput.isEmpty
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
        argument.parameter.type === RequireType.Required &&
        (!parameter || parameter[0].trim().length === 0)
      ) {
        const first = wholeTokens[0].pos;
        const last = wholeTokens.slice(-1)[0];
        return new Message(
          MessageType.Error,
          argument.primaryInput.message ||
            `Rule '${argument.namespace}:${argument.name}' requires parameter`,
          first.line,
          first.real,
          last.pos.real + last.length
        );
      }

      if (
        argument.parameter.type === RequireType.Redundant &&
        (parameter && parameter[0].trim().length !== 0)
      ) {
        const first = parameter[1][0].pos;
        const last = parameter[1].slice(-1)[0];
        messages.push(
          new Message(
            MessageType.Warning,
            argument.primaryInput.message ||
              `The parameter of rule '${argument.namespace}:${
                argument.name
              }' is redundant`,
            first.line,
            first.real,
            last.pos.real + last.length
          )
        );
      }
      return new RenderableType(
        ({
          parameter:
            argument.parameter.type === RequireType.Redundant
              ? undefined
              : parameter,
          primaryInput:
            argument.primaryInput.type === RequireType.Redundant
              ? undefined
              : primaryInput
        } as any) as NonNullable<OutputOf<T>>,
        primaryInput
      );
    },
    name: argument.name,
    namespace: argument.namespace
  };

  return Rule;
}
