import * as t from "io-ts";

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
