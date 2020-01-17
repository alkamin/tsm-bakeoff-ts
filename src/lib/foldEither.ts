import { Either, fold } from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/pipeable";

/**
 * Directly pattern match on an fp-ts Either without pipe
 */
export default function foldEither<E, A, B>(
  x: Either<E, A>,
  onLeft: () => B,
  onRight: (a: A) => B
): B {
  return pipe(
    x,
    fold(onLeft, onRight)
  );
}
