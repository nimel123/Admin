import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, Slider, Button, Autocomplete } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

// Set Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center]);
  return null;
}

ChangeView.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function AddServiceArea() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [range, setRange] = useState(3.2); // km

  const [areaTitle, setAreaTitle] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([29.1492, 75.7217]); // Default fallback coords
  const [zoneOptions, setZoneOptions] = useState([]);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Fetch cities from API on mount
  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getcitydata");
        const data = await res.json();
        if (data.result && data.result.length > 0) {
          setCities(data.result);
          // Set first city as default selected
          const firstCity = data.result[0];
          setCity(firstCity);
          setMarkerPosition([firstCity.latitude, firstCity.longitude]);
          setLatitude(firstCity.latitude);
          setLongitude(firstCity.longitude);
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
        alert("Failed to load cities from API.");
      }
    }
    fetchCities();
  }, []);

  const handleRangeChange = (_, newValue) => {
    setRange(newValue);
  };

  const handleZoneSearch = async (query) => {
    if (query.length < 3) return;

    try {
      const fullQuery = `${query}, ${city.city}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=10`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "my-zone-app (example@email.com)",
          "Accept-Language": "en",
        },
      });

      const data = await res.json();

      setZoneOptions(
        data.map((loc) => ({
          label: loc.display_name,
          lat: parseFloat(loc.lat),
          lon: parseFloat(loc.lon),
        }))
      );
    } catch (err) {
      console.error("Zone search failed:", err);
      alert("Failed to fetch zone suggestions. Please try again later.");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleZoneSearch(areaTitle);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [areaTitle, city]);

  const handleZoneSelect = (event, newValue) => {
    if (newValue && newValue.lat && newValue.lon) {
      setMarkerPosition([newValue.lat, newValue.lon]);
      setLatitude(newValue.lat);
      setLongitude(newValue.lon);
      setAreaTitle(newValue.label);
    }
  };

  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    const selectedCity = cities.find((c) => c.city === selectedCityName);
    if (selectedCity) {
      setCity(selectedCity);
      setMarkerPosition([selectedCity.latitude, selectedCity.longitude]);
      setLatitude(selectedCity.latitude);
      setLongitude(selectedCity.longitude);
      setAreaTitle(""); // Clear zone input on city change
      setZoneOptions([]);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        city: city.city,
        address: areaTitle,
        latitude,
        longitude,
        range: range * 1000,
      };

      const result = await fetch("https://node-m8jb.onrender.com/addLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (result.status === 200) {
        alert("Area Saved Successfully");
        navigate(-1);
      } else {
        const errRes = await result.json();
        alert("Failed to save area: " + errRes.message);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("An error occurred while saving the area.");
    }
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
      <div
        style={{
          padding: "20px",
          maxWidth: "65%",
          margin: "0 auto",
          fontFamily: "Arial",
        }}
      >
        <h2 style={{ textAlign: "center", color: "green", marginBottom: "40px" }}>ADD NEW ZONE</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <label>City</label>
          <select style={{ width: "70%" }} onChange={handleCityChange} value={city?.city || ""}>
            {cities.map((city) => (
              <option key={city._id} value={city.city}>
                {city.city}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <label>Zone</label>
          <Autocomplete
            freeSolo
            options={zoneOptions}
            getOptionLabel={(option) => option.label || ""}
            onInputChange={(e, newInputValue) => setAreaTitle(newInputValue)}
            onChange={handleZoneSelect}
            renderInput={(params) => (
              <TextField {...params} placeholder="Enter Zone" style={{ width: "100%", }} />
            )}
            style={{ width: "70%" }}
            inputValue={areaTitle}
          />
        </div>

        <div
          style={{
            width: "100%",
            height: "250px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <MapContainer center={markerPosition} zoom={13} style={{ width: "100%", height: "100%" }}>
            <ChangeView center={markerPosition} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={markerPosition}>
              <Popup>{areaTitle || "Selected Location"}</Popup>
            </Marker>
            <Circle center={markerPosition} radius={range * 1000} pathOptions={{ color: "red" }} />
          </MapContainer>
        </div>

        <label>Select Range</label>
        <Slider
          value={range}
          onChange={handleRangeChange}
          min={0.1}
          max={50}
          step={0.1}
          valueLabelDisplay="auto"
          style={{ color: "#007bff", marginBottom: "10px" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>0.1 km</span>
          <span>{range.toFixed(1)} km</span>
          <span>50 km</span>
        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px",backgroundColor:'#00c853' }}
          onClick={handleSave}
        >
          <h4 style={{ color: "white",fontSize:'15px' }}>Save Service Area</h4>
        </Button>
      </div>
    </MDBox>
  );
}

export default AddServiceArea;
