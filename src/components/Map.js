// src/components/Map.js
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const Map = ({ geoUrl, hoveredState, selectedState, handleMouseEnter, handleMouseLeave }) => {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{
        scale: 500,
      }}
      style={{ position: "relative", zIndex: 1, top: "-120px" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies, outline, borders }) => (
          <>
            <Geography geography={outline} fill="#E9E3DA" />
            <Geography geography={borders} fill="none" stroke="#FFF" />
            {geographies &&
              geographies.map((geo) => {
                const isSelected = geo.properties.name === selectedState;
                const isHovered = geo.id === hoveredState;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    fill={
                      isHovered
                        ? "#FF5733"
                        : isSelected
                        ? "#E42A1D"
                        : "#D6D6DA"
                    }
                    stroke="#333"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: "#FF5733",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#E42A1D",
                      },
                    }}
                  />
                );
              })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default Map;