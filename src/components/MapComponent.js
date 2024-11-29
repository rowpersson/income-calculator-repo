import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null); // For tracking hover
  const [clickedState, setClickedState] = useState(null); // For tracking clicked state

  // Function to handle mouse enter event (hovering over a state)
  const handleMouseEnter = (geo) => {
    setHoveredState(geo.id); // Set the hovered state to the state id
  };

  // Function to handle mouse leave event (stopping hover over a state)
  const handleMouseLeave = () => {
    setHoveredState(null); // Reset hovered state
  };

  // Function to handle click event on a state
  const handleClick = (geo) => {
    setClickedState(geo.properties.name); // Set the clicked state's name
  };

  return (
    <div style={{ position: "relative", height: "50vh" }}>
      {/* Text box above the map */}
      <div
        style={{
          position: "relative",
          top: "1px", // Adjust the distance between the text box and the map
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2, // Make sure the text box stays above the map
        }}
      >
        <input
          type="text"
          value={clickedState || ""} // Show an empty string if clickedState is null
          readOnly
          style={{
            padding: "8px",
            fontSize: "12px", // Slightly larger text size
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "250px",
            textAlign: "center",
          }}
        />
      </div>

      {/* Map component */}
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 800, // Adjust the scale value to zoom out (lower value)
        }}
        style={{ position: "relative", zIndex: 1 }} // Keep the map below the text box
      >
        <Geographies geography={geoUrl}>
          {({ geographies, outline, borders }) => (
            <>
              <Geography geography={outline} fill="#E9E3DA" />
              <Geography geography={borders} fill="none" stroke="#FFF" />

              {geographies.map((geo) => {
                const isHovered = geo.id === hoveredState; // Check if the current state is being hovered
                const isClicked = geo.properties.name === clickedState; // Check if the current state was clicked

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)} // Trigger on mouse enter
                    onMouseLeave={handleMouseLeave} // Trigger on mouse leave
                    onClick={() => handleClick(geo)} // Trigger on click to set clicked state
                    fill={isHovered ? "#FF5733" : isClicked ? "#E42A1D" : "#D6D6DA"} // Change color on hover or click
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
                        fill: "#E42A1D", // Color for clicked state
                      },
                    }}
                  />
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapComponent;
