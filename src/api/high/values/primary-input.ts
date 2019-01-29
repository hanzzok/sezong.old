import { NullableContextualFunctionalValue } from '.';

export interface PrimaryInputContext {
  primaryInput?: string;
}

export const primaryInput = () =>
  new NullableContextualFunctionalValue<PrimaryInputContext, string>(
    context => context.primaryInput
  );
