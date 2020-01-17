import React from "react";
import ReactMapGL, { ViewportProps, Source, Layer } from "react-map-gl";
import { SymbolLayout } from "types/mapbox-gl";
import { SchoolFeatureCollection } from "types";

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

type Props = {
  data: SchoolFeatureCollection | undefined;
  viewport: ViewportProps | undefined;
  onViewportChange: (v: ViewportProps) => void;
};

export default ({ data, viewport, onViewportChange }: Props) => (
  <ReactMapGL
    width={0}
    height={0}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    mapStyle="mapbox://styles/mapbox/light-v9"
    onViewportChange={onViewportChange}
    longitude={-75.1652}
    latitude={39.9826}
    zoom={11}
    {...viewport}
  >
    <Source type="geojson" data={data} cluster={true} clusterMaxZoom={14}>
      <Layer {...dataLayer} />
      <Layer {...labelLayer} />
    </Source>
  </ReactMapGL>
);
