export const enum RequireType {
  Optional,
  Required,
  Redundant
}

export interface RequireCondition {
  type: RequireType;
  message?: string;
}

export type RequiredCondition = RequireCondition & {
  type: RequireType.Required;
};

export type OptionalCondition = RequireCondition & {
  type: RequireType.Optional;
};

export type RedundantCondition = RequireCondition & {
  type: RequireType.Redundant;
};

export function required(messageNotSupplied?: string): RequiredCondition {
  return {
    message: messageNotSupplied,
    type: RequireType.Required
  };
}

export function optional(): OptionalCondition {
  return {
    type: RequireType.Optional
  };
}

export function redundant(messageWhenSupplied?: string): RedundantCondition {
  return {
    message: messageWhenSupplied,
    type: RequireType.Redundant
  };
}
