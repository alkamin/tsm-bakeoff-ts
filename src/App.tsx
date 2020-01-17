import React, { useMemo, useState } from "react";
import AppContainer from "components/AppContainer";
import AppHeader from "components/AppHeader";
import AppBody from "components/AppBody";
import { Box, Text } from "@blasterjs/core";
import * as t from "io-ts";
import { geoJSONFeatureCollectionCodec, geoJSONPointCodec } from "types";
import { optionFromNullable } from "io-ts-types/lib/optionFromNullable";
import { useAsync, useMeasure } from "react-use";
import { decodeT } from "lib/transformers";
import LoadingIcon from "components/LoadingIcon";
import { Option, fromNullable, none, some } from "fp-ts/es6/Option";
import foldOption from "lib/foldOption";
import ReactMapGL, { Source, Layer, ViewportProps } from "react-map-gl";
import { SymbolLayout } from "types/mapbox-gl";

const DATA_URL =
  "https://gist.githubusercontent.com/alkamin/f8903b479c602975aec4fc0579dcf86b/raw/0fb572fbbe1cabe15ded604644d4a064f8c9945f/schools.geojson";

const schoolPropertiesCodec = t.type({
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

const schoolFeatureCollectionCodec = geoJSONFeatureCollectionCodec(
  geoJSONPointCodec,
  schoolPropertiesCodec
);
type SchoolFeatureCollection = t.TypeOf<typeof schoolFeatureCollectionCodec>;

const App: React.FC = () => {
  const { value, error, loading } = useAsync<SchoolFeatureCollection>(
    async () => {
      const response = await fetch(DATA_URL);
      const result = await response.text();
      const decode = decodeT<SchoolFeatureCollection>(
        schoolFeatureCollectionCodec
      );
      return decode(JSON.parse(result));
    }
  );

  const [mapRef, { width: mapWidth, height: mapHeight }] = useMeasure<
    HTMLDivElement
  >();

  const [viewportBase, setViewport] = useState<ViewportProps>();

  const viewport = { ...viewportBase, width: mapWidth, height: mapHeight };

  const schoolTypeCountsOption: Option<Record<string, number>> = useMemo(
    () =>
      foldOption(
        fromNullable(value),
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
      ),
    [value]
  );

  const dataLayer = {
    id: "points",
    type: "circle",
    paint: {
      "circle-radius": 4
    }
  };

  const labelLayer = {
    id: "labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "SCHOOL_NAME"],
      "text-font": ["Open Sans Semibold"],
      "text-offset": [0, 0.6],
      "text-anchor": "top"
    } as SymbolLayout,
    paint: {}
  };

  return (
    <AppContainer>
      <AppHeader>TSM Bakeoff: React + TypeScript + fp-ts + io-ts</AppHeader>
      {loading ? (
        <LoadingIcon />
      ) : error ? (
        <Text>{error.message}</Text>
      ) : (
        <AppBody>
          <AppBody.Sidebar>
            <Text fontWeight="bold">Stats</Text>
            {foldOption(
              schoolTypeCountsOption,
              () => (
                <LoadingIcon />
              ),
              counts => (
                <>
                  {Object.entries(counts).map(([schoolType, count], idx) => (
                    <Box key={idx} display="flex">
                      <Text flex="1">{schoolType}</Text>
                      <Text fontWeight="bold" width="50px">
                        {count}
                      </Text>
                    </Box>
                  ))}
                </>
              )
            )}
          </AppBody.Sidebar>
          <AppBody.Main ref={mapRef}>
            <ReactMapGL
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              width={mapWidth}
              height={mapHeight}
              mapStyle="mapbox://styles/mapbox/light-v9"
              onViewportChange={viewport => setViewport(viewport)}
              longitude={-75.1652}
              latitude={39.9826}
              zoom={11}
              {...viewport}
            >
              <Source
                type="geojson"
                data={value}
                cluster={true}
                clusterMaxZoom={14}
              >
                <Layer {...dataLayer} />
                <Layer {...labelLayer} />
              </Source>
            </ReactMapGL>
          </AppBody.Main>
        </AppBody>
      )}
    </AppContainer>
  );
};

export default App;
