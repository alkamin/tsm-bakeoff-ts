import { Option, some, none, fromNullable } from "fp-ts/es6/Option";
import foldOption from "lib/foldOption";
import { SchoolFeatureCollection } from "types";

export default (
  data: SchoolFeatureCollection | undefined
): Option<Record<string, number>> =>
  foldOption(
    fromNullable(data),
    () => none,
    schools =>
      some(
        schools.features.reduce(
          (acc, school) =>
            foldOption(
              school.properties.TYPE_SPECIFIC,
              () => ({
                ...acc,
                unknown: acc.unknown ? acc.unknown + 1 : 1
              }),
              type => ({ ...acc, [type]: acc[type] ? acc[type] + 1 : 1 })
            ),
          {} as Record<string, number>
        )
      )
  );
