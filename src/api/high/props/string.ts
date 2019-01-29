import { Prop } from './base';

export default class PropString<C> extends Prop<C, string> {
  public static readonly instance = new PropString();

  private constructor() {
    super(it => {
      if (!it) {
        return;
      }
      return it;
    });
  }
}
