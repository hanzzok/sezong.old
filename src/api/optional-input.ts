export type OptionalInput =
  | undefined
  | string
  | Array<string | [string, string]>;

export function joinOptionalInput(origin: OptionalInput): string {
  if (origin === undefined) {
    return '';
  } else if (typeof origin === 'string') {
    return origin;
  } else {
    return origin
      .map(it => {
        if (typeof it === 'string') {
          return it;
        } else {
          const [left, right] = it;
          return `${left} = ${right}`;
        }
      })
      .join(',');
  }
}
