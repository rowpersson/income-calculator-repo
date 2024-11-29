import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const markers = [
  { markerOffset: -20, name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { markerOffset: -20, name: "Boston", coordinates: [-71.0589, 42.3601] },
  { markerOffset: -20, name: "Tulsa", coordinates: [-95.9928, 36.154] },
  { markerOffset: -20, name: "Baltimore", coordinates: [-76.6122, 39.2904] },
  { markerOffset: -20, name: "Miami", coordinates: [-80.1918, 25.7617] },
  {
    markerOffset: 30,
    name: "Washington, D.C.",
    coordinates: [-77.0369, 38.9072],
  },
  { markerOffset: -20, name: "Los Angeles", coordinates: [-118.2426, 34.0549] },
];

const MapComponent = () => {
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies, outline, borders }) => (
          <>
            <Geography geography={outline} fill="#E9E3DA" />
            <Geography geography={borders} fill="none" stroke="#FFF" />
          </>
        )}
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates} id={name}>
          <circle r={15} fill="#E42A1D" stroke="#fff" strokeWidth={2} />
          {/* <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text> */}
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default MapComponent;
