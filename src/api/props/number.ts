import { MessageType } from '../../core';
import { Prop } from './base';
import ValidationMessage from './validation-message';

const NumberRegex = /^[+-]?([0-9]+\.?|[0-9]*(\.[0-9]+))$/;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

function omit<T, K>(origin: T, excludes: K[]): Omit<T, K> {
  const result: any = origin;
  for (const exclude of excludes) {
    result[exclude] = undefined;
  }

  return result as Omit<T, K>;
}

export default class PropNumber extends Prop<any, number> {
  public static readonly instance = new PropNumber();
  private constructor() {
    super((value, _, key) => {
      if (!value) {
        return;
      }
      if (!NumberRegex.test(value)) {
        return new ValidationMessage(
          MessageType.Error,
          `${value} is not valid number.`,
          key
        );
      }

      return parseFloat(value);
    });
  }

  public min(
    start: number,
    inclusive: boolean = false
  ): Omit<this, 'min' | 'range'> {
    const filter = (value: number) =>
      inclusive ? start <= value : start < value;
    return omit<this, 'min' | 'range'>(
      this.restricts((value, key) => {
        if (filter(value)) {
          return false;
        } else {
          return new ValidationMessage(
            MessageType.Error,
            `Number must be greater than ${
              inclusive ? 'or equals to ' : ''
            }${start}`,
            key,
            { from: 0, to: value.toString().length }
          );
        }
      }),
      ['min', 'range']
    );
  }

  public max(
    end: number,
    inclusive: boolean = false
  ): Omit<this, 'max' | 'range'> {
    const filter = (value: number) => (inclusive ? value <= end : value < end);
    return omit<this, 'max' | 'range'>(
      this.restricts((value, key) => {
        if (filter(value)) {
          return false;
        } else {
          return new ValidationMessage(
            MessageType.Error,
            `Number must be less than ${
              inclusive ? 'or equals to ' : ''
            }${end}`,
            key,
            { from: 0, to: value.toString().length }
          );
        }
      }),
      ['max', 'range']
    );
  }

  public range(
    start: number,
    end: number,
    inclusive: boolean | { start: boolean; end: boolean } = false
  ): Omit<this, 'min' | 'max' | 'range'> {
    const startInclusive = typeof inclusive === 'boolean' || inclusive.start;
    const endInclusive =
      inclusive !== false && (inclusive === true || inclusive.end);
    const startFilter = (value: number) =>
      startInclusive ? start <= value : start < value;
    const endFilter = (value: number) =>
      endInclusive ? value <= end : value < end;
    return omit<this, 'min' | 'max' | 'range'>(
      this.restricts((value, key) => {
        if (!startFilter(value)) {
          return new ValidationMessage(
            MessageType.Error,
            `Number must be greater than ${
              inclusive ? 'or equals to ' : ''
            }${start} (must be in range ${start} ${
              startInclusive ? '<=' : '<'
            } x ${endInclusive ? '<=' : '<'} ${end}`,
            key,
            { from: 0, to: value.toString().length }
          );
        } else if (!endFilter(value)) {
          return new ValidationMessage(
            MessageType.Error,
            `Number must be less than ${
              inclusive ? 'or equals to ' : ''
            }${end} (must be in range ${start} ${
              startInclusive ? '<=' : '<'
            } x ${endInclusive ? '<=' : '<'} ${end}`,
            key,
            { from: 0, to: value.toString().length }
          );
        } else {
          return false;
        }
      }),
      ['min', 'max', 'range']
    );
  }
}
