export class ContextualFunctionalValue<C, T> {
  constructor(private readonly value: (context: C) => NonNullable<T>) {}

  public getByContext(context: C): NonNullable<T> {
    return this.value(context);
  }

  public map<U>(
    mapper: (source: NonNullable<T>) => NonNullable<U>
  ): ContextualFunctionalValue<C, U> {
    return new ContextualFunctionalValue(context =>
      mapper(this.value(context))
    );
  }
}

export class NullableContextualFunctionalValue<C, T> {
  constructor(
    private readonly value: (context: C) => NonNullable<T> | undefined | null
  ) {}

  public getByContext(context: C): NonNullable<T> | undefined | null {
    return this.value(context);
  }

  public map<U>(
    mapper: (source: NonNullable<T>) => NonNullable<U>
  ): NullableContextualFunctionalValue<C, U> {
    return new NullableContextualFunctionalValue(context => {
      const value = this.value(context);
      return value && mapper(value);
    });
  }

  public orElse(
    defaultValue: ContextualValue<C, T>
  ): ContextualFunctionalValue<C, T> {
    return new ContextualFunctionalValue<C, T>(context => {
      const value = this.value(context);
      return value || extractContextualValue(context, defaultValue);
    });
  }
}

export class FunctionalValue<T> {
  constructor(private readonly value: () => NonNullable<T>) {}

  public get(): NonNullable<T> {
    return this.value();
  }

  public map<U>(
    mapper: (source: NonNullable<T>) => NonNullable<U>
  ): FunctionalValue<U> {
    return new FunctionalValue(() => mapper(this.value()));
  }
}

export class NullableFunctionalValue<T> {
  constructor(
    private readonly value: () => NonNullable<T> | undefined | null
  ) {}

  public get(): NonNullable<T> | undefined | null {
    return this.value();
  }

  public map<U>(
    mapper: (source: NonNullable<T>) => NonNullable<U>
  ): NullableFunctionalValue<U> {
    return new NullableFunctionalValue(() => {
      const value = this.value();
      return value && mapper(value);
    });
  }

  public orElse(defaultValue: Value<T>) {
    return new FunctionalValue<T>(() => {
      const value = this.value();
      return value || extractValue(defaultValue);
    });
  }
}

export type Value<T> = NonNullable<T> | FunctionalValue<T>;

export type ContextualValue<C, T> = Value<T> | ContextualFunctionalValue<C, T>;

export function extractValue<T>(value: Value<T>): NonNullable<T> {
  if (value instanceof FunctionalValue) {
    return value.get();
  } else {
    return value;
  }
}

export function extractContextualValue<C, T>(
  context: C,
  value: ContextualValue<C, T>
): NonNullable<T> {
  if (value instanceof FunctionalValue) {
    return value.get();
  } else if (value instanceof ContextualFunctionalValue) {
    return value.getByContext(context);
  } else {
    return value;
  }
}

export function extractNullableValue<C, T>(
  context: C,
  value: ContextualValue<C, T>
): T {
  if (value instanceof FunctionalValue) {
    return value.get();
  } else if (value instanceof ContextualFunctionalValue) {
    return value.getByContext(context);
  } else {
    return value;
  }
}
