import * as t from "io-ts";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";

export class EnumType<A> extends t.Type<A> {
  public readonly _tag: "EnumType" = "EnumType";
  public enumObject!: object;
  public constructor(e: object, name?: string) {
    super(
      name || "enum",
      (u): u is A => Object.values(this.enumObject).some(v => v === u),
      (u, c) => (this.is(u) ? t.success(u) : t.failure(u, c)),
      t.identity
    );
    this.enumObject = e;
  }
}

export function createEnumType<T>(e: object, name?: string) {
  return new EnumType<T>(e, name);
}

export const geoJSONPointCodec = t.type({
  type: t.literal("Point"),
  coordinates: t.tuple([t.number, t.number])
});

export const geoJSONFeatureCodec = <G extends t.Mixed, P extends t.Mixed>(
  geometryCodec: G,
  propertiesCodec: P
) =>
  t.type({
    geometry: geometryCodec,
    type: t.literal("Feature"),
    properties: propertiesCodec
  });

export const geoJSONFeatureCollectionCodec = <
  G extends t.Mixed,
  P extends t.Mixed
>(
  geometryCodec: G,
  propertiesCodec: P
) =>
  t.type({
    type: t.literal("FeatureCollection"),
    features: t.array(geoJSONFeatureCodec(geometryCodec, propertiesCodec))
  });

export const schoolPropertiesCodec = t.type({
  OBJECTID: t.number,
  AUN: optionFromNullable(t.number),
  SCHOOL_NUM: optionFromNullable(t.number),
  LOCATION_ID: optionFromNullable(t.string),
  SCHOOL_NAME: t.string,
  SCHOOL_NAME_LABEL: t.string,
  STREET_ADDRESS: t.string,
  ZIP_CODE: t.string,
  PHONE_NUMBER: t.string,
  ACTIVE: optionFromNullable(t.string),
  GRADE_LEVEL: optionFromNullable(t.string),
  GRADE_ORG: optionFromNullable(t.string),
  ENROLLMENT: optionFromNullable(t.number),
  TYPE: t.number,
  TYPE_SPECIFIC: optionFromNullable(t.string)
});

export const schoolFeatureCollectionCodec = geoJSONFeatureCollectionCodec(
  geoJSONPointCodec,
  schoolPropertiesCodec
);
export type SchoolFeatureCollection = t.TypeOf<
  typeof schoolFeatureCollectionCodec
>;
