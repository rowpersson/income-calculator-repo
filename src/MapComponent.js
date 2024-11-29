import React, { forwardRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Hardcoded geo data for California
const geoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "California"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-124.482003, 32.528832],
            [-114.131211, 32.528832],
            [-114.131211, 42.009518],
            [-124.482003, 42.009518],
            [-124.482003, 32.528832]
          ]
        ]
      }
    }
  ]
};

const MapComponent = forwardRef((props, ref) => {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid red", // Make the container clearly visible
        backgroundColor: "#f0f0f0" // Grey background to make the map container visible
      }}
      ref={ref}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000 }} // Adjust the scale to ensure the map fits
        width={800}
        height={500}
      >
        <Geographies geography={geoData}>
          {({ geographies, loaded, error }) => {
            if (error) {
              console.error("Error loading map data:", error);
              return <div>Error loading map data!</div>;
            }

            if (!loaded) {
              return <div>Loading map...</div>;
            }

            console.log("Geographies:", geographies); // Log geographies to verify

            return geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D6D6DA" // Color for the map feature
                stroke="#333" // Stroke color for boundaries
                strokeWidth={0.5}
              />
            ));
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
});

export default MapComponent;
