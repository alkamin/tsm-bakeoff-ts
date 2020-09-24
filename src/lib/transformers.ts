import { TypeC } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import foldEither from "lib/foldEither";

export const decodeT = <T extends {}>(c: TypeC<any>) => (data: any): T => {
  const result = c.decode(data);
  return foldEither(
    result,
    () => {
      const e = PathReporter.report(result)
        .join("\n\n\n")
        .concat(` when decoding ${JSON.stringify(data)}`);
      throw new Error(e);
    },
    (decoded) => decoded
  );
};
