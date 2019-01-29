import PropNumber from './number';
import PropString from './string';
import { InputOf, OutputOf, Props } from './types';
import ValidationMessage from './validation-message';

export * from './types';

export const p = {
  number: () => PropNumber.instance,
  string: () => PropString.instance
};

export function createExtractor<C, T extends Props<C>>(
  context: C,
  props: T,
  unknownKeyAcceptor: (unknownKey: string) => void
): (input: InputOf<T> | undefined) => [OutputOf<T>, ValidationMessage[]] {
  const propNames = Object.keys(props);
  return inputReal => {
    const messages: ValidationMessage[] = [];
    const result: any = {};
    if (inputReal) {
      for (const key of Object.keys(inputReal)) {
        if (!propNames.includes(key)) {
          unknownKeyAcceptor(key);
          continue;
        }
        result[key] = props[key].extract(
          inputReal[key],
          context,
          key,
          messages
        );
      }
    }
    for (const key of propNames) {
      if (result[key]) {
        continue;
      }
      result[key] = props[key].extract(undefined, context, key, messages);
    }
    return [result as OutputOf<T>, messages];
  };
}
