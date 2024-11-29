import React, { useState } from "react";
import { geoCentroid } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  // Track the hovered state
  const [hoveredState, setHoveredState] = useState(null);

  // Function to handle mouse enter event
  const handleMouseEnter = (geo) => {
    setHoveredState(geo.id); // Set the hovered state
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setHoveredState(null); // Reset hovered state
  };

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies, outline, borders }) => (
          <>
            <Geography geography={outline} fill="#E9E3DA" />
            <Geography geography={borders} fill="none" stroke="#FFF" />

            {geographies.map((geo) => {
              const isHovered = geo.id === hoveredState; // Check if the state is hovered

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(geo)} // Trigger on mouse enter
                  onMouseLeave={handleMouseLeave} // Trigger on mouse leave
                  fill={isHovered ? "#FF5733" : "#D6D6DA"} // Highlight hovered state
                  stroke="#333"
                  strokeWidth={0.5}
                />
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapComponent;
