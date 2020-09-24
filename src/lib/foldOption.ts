import { Option, fold } from "fp-ts/es6/Option";
import { pipe } from "fp-ts/es6/pipeable";

/**
 * Directly pattern match on an fp-ts Option without pipe
 */
export default function foldOption<A, B>(
  x: Option<A>,
  onNone: () => B,
  onSome: (a: A) => B
): B {
  return pipe(x, fold(onNone, onSome));
}
