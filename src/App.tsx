import React, { useState } from "react";
import AppContainer from "components/AppContainer";
import AppHeader from "components/AppHeader";
import AppBody from "components/AppBody";
import { Text } from "@blasterjs/core";
import { useAsync, useMeasure } from "react-use";
import LoadingIcon from "components/LoadingIcon";
import { ViewportProps } from "react-map-gl";
import Map from "components/Map";

const App: React.FC = () => {
  const collection = {
    stac_version: "0.9.0",
    stac_extensions: ["label"],
    id: "berlin",
    title: null,
    description:
      "Pixel masks for buildings in Berlin generated using Deeplab and other AI algorithms with Sentinel 2",
    keywords: [],
    license: "proprietary",
    providers: [],
    extent: {
      spatial: {
        bbox: [
          [
            13.330610521659846,
            52.363530645448044,
            13.756192207996433,
            52.64467528345354,
          ],
        ],
      },
      temporal: {
        interval: [["2018-03-03T10:20:19Z", "2018-03-03T10:20:19Z"]],
      },
    },
    summaries: {},
    properties: {},
    links: [
      {
        href: "http://localhost:9090/collections/berlin/items",
        rel: "items",
        type: "application/json",
        title: null,
      },
      {
        href: "http://localhost:9090/collections/berlin",
        rel: "self",
        type: "application/json",
        title: null,
      },
    ],
  };
  const { value, error, loading } = useAsync<typeof collection>(async () => {
    const result = await Promise.resolve(collection);
    return result;
  });

  const [mapRef, { width: mapWidth, height: mapHeight }] = useMeasure<
    HTMLDivElement
  >();

  const [viewportBase, setViewport] = useState<ViewportProps>();

  const viewport = viewportBase && {
    ...viewportBase,
    width: mapWidth,
    height: mapHeight,
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
          </AppBody.Sidebar>
          <AppBody.Main ref={mapRef}>
            <Map
              data={value}
              viewport={viewport}
              onViewportChange={(viewport) => setViewport(viewport)}
            />
          </AppBody.Main>
        </AppBody>
      )}
    </AppContainer>
  );
};

export default App;
