import { ContextualValue, extractContextualValue } from '../values';
import ValidationMessage from './validation-message';

type NotValidationMessage<T> = T extends ValidationMessage ? never : T;

export type Extractor<C, T> = (
  input: string | undefined,
  context: C,
  key: string,
  messages: ValidationMessage[]
) => NotValidationMessage<T> | ValidationMessage | void;

export abstract class AbstractProp<C, T> {
  public readonly T: T = (null as any) as NotValidationMessage<T>;

  public constructor(public readonly extract: Extractor<C, T>) {}

  public restricts(
    restriction: (
      output: T,
      key: string
    ) => ValidationMessage | null | undefined | false
  ): this {
    return (this as any).__proto__.constructor(
      (
        value: string | undefined,
        context: C,
        key: string,
        messages: ValidationMessage[]
      ) => {
        const checkResult = this.extract(value, context, key, messages);
        if (checkResult instanceof ValidationMessage) {
          return checkResult;
        }
        if (!checkResult) {
          return;
        }
        const restrictResult = restriction(checkResult, key);
        if (restrictResult instanceof ValidationMessage) {
          return restrictResult;
        }
        return checkResult;
      }
    );
  }
}

export abstract class Prop<C, T> extends AbstractProp<C, NonNullable<T>> {
  public constructor(check: Extractor<C, NonNullable<T>>) {
    super(check);
  }

  public nullable(): PropNullable<C, T> {
    return new PropNullable(this);
  }

  public default(
    value: ContextualValue<C, NotValidationMessage<T>>
  ): PropDefault<C, T> {
    return new PropDefault(this, value);
  }
}

export class PropDefault<C, T> extends AbstractProp<C, T> {
  constructor(
    parent: AbstractProp<C, NonNullable<T>>,
    public readonly value: ContextualValue<C, NotValidationMessage<T>>
  ) {
    super(
      (input, context, key, messages) =>
        (input ? parent.extract(input, context, key, messages) : null) ||
        extractContextualValue(context, value)
    );
  }
}

export class PropNullable<C, T> extends AbstractProp<C, T | null> {
  constructor(parent: AbstractProp<C, NonNullable<T>>) {
    super((input, context, key, messages) =>
      input ? parent.extract(input, context, key, messages) : null
    );
  }
}
