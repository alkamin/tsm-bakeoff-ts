import React, { useMemo, useState } from "react";
import AppContainer from "components/AppContainer";
import AppHeader from "components/AppHeader";
import AppBody from "components/AppBody";
import { Text } from "@blasterjs/core";
import { SchoolFeatureCollection, schoolFeatureCollectionCodec } from "types";
import { useAsync, useMeasure } from "react-use";
import { decodeT } from "lib/transformers";
import LoadingIcon from "components/LoadingIcon";
import foldOption from "lib/foldOption";
import { ViewportProps } from "react-map-gl";
import getCountsByType from "helpers/getCountsByType";
import { SchoolTypeCounts } from "components/SchoolTypeCounts";
import SchoolMap from "components/SchoolMap";

const DATA_URL =
  "https://gist.githubusercontent.com/alkamin/f8903b479c602975aec4fc0579dcf86b/raw/0fb572fbbe1cabe15ded604644d4a064f8c9945f/schools.geojson";

const App: React.FC = () => {
  const { value, error, loading } = useAsync<SchoolFeatureCollection>(
    async () => {
      const response = await fetch(DATA_URL);
      const result = await response.json();
      const decode = decodeT<SchoolFeatureCollection>(
        schoolFeatureCollectionCodec
      );
      return decode(result);
    }
  );

  const [mapRef, { width: mapWidth, height: mapHeight }] = useMeasure<
    HTMLDivElement
  >();

  const [viewportBase, setViewport] = useState<ViewportProps>();

  const viewport = viewportBase && {
    ...viewportBase,
    width: mapWidth,
    height: mapHeight
  };

  const schoolTypeCountsOption = useMemo(() => getCountsByType(value), [value]);

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
                <SchoolTypeCounts counts={counts} />
              )
            )}
          </AppBody.Sidebar>
          <AppBody.Main ref={mapRef}>
            <SchoolMap
              data={value}
              viewport={viewport}
              onViewportChange={viewport => setViewport(viewport)}
            />
          </AppBody.Main>
        </AppBody>
      )}
    </AppContainer>
  );
};

export default App;
