import React, { useState, useEffect } from "react";
import { TextField, Slider, Button, Autocomplete } from "@mui/material";
import { GoogleMap, Marker, Circle, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import ZoneInfo from '../../assets/images/zone_info.gif';

import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

function AddServiceArea() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [range, setRange] = useState(3.2);
  const [areaTitle, setAreaTitle] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 29.1492, lng: 75.7217 });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [stores, setStores] = useState([]); // State for stores
  const [storeId, setStoreId] = useState(""); // Selected store ID

  // Dummy store data based on city
  const dummyStoresByCity = {
    "city1_id": [
      { _id: "store1", name: "City 1 Store A", zoneAddress: "Downtown, City 1" },
      { _id: "store2", name: "City 1 Store B", zoneAddress: "Uptown, City 1" },
    ],
    "city2_id": [
      { _id: "store3", name: "City 2 Store A", zoneAddress: "Central, City 2" },
      { _id: "store4", name: "City 2 Store B", zoneAddress: "Westside, City 2" },
    ],
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDnXzpb-5ImxSpoTdmOWlAqBcjtnfw4QLU",
    libraries,
  });

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch("https://fivlia.onrender.com/getAviableCity");
        const data = await res.json();
        if (data && data.length > 0) {
          setCities(data);
          const firstCity = data[0];
          setCity(firstCity);
          const coords = { lat: firstCity.latitude, lng: firstCity.longitude };
          setMarkerPosition(coords);
          setLatitude(coords.lat);
          setLongitude(coords.lng);
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
        alert("Failed to load cities from API.");
      }
    }
    fetchCities();
  }, []);

  // Populate stores based on the selected city (using dummy data)
  useEffect(() => {
    if (city?._id) {
      const cityStores = dummyStoresByCity[city._id] || [];
      setStores(cityStores);
      setStoreId(""); // Reset selected store when city changes
    } else {
      setStores([]);
      setStoreId("");
    }
  }, [city]);

  const handleRangeChange = (_, newValue) => setRange(newValue);

  const handleZoneSearch = async (query) => {
    if (query.length < 3) return;

    try {
      const fullQuery = `${query}, ${city?.city || ""}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=10`;

      const res = await fetch(url);
      const data = await res.json();

      setZoneOptions(
        data.map((loc) => ({
          label: loc.display_name,
          lat: parseFloat(loc.lat),
          lng: parseFloat(loc.lon),
        }))
      );
    } catch (err) {
      console.error("Zone search failed:", err);
      alert("Failed to fetch zone suggestions.");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (areaTitle) {
        handleZoneSearch(areaTitle);
      } else {
        setZoneOptions([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [areaTitle, city]);

  const handleZoneSelect = (event, newValue) => {
    if (newValue && newValue.lat && newValue.lng) {
      const coords = { lat: newValue.lat, lng: newValue.lng };
      setMarkerPosition(coords);
      setLatitude(coords.lat);
      setLongitude(coords.lng);
      setAreaTitle(newValue.label);
    }
  };

  const handleCityChange = (event) => {
    const selectedCity = cities.find((c) => c._id === event.target.value);
    if (selectedCity) {
      const coords = { lat: selectedCity.latitude, lng: selectedCity.longitude };
      setCity(selectedCity);
      setMarkerPosition(coords);
      setLatitude(coords.lat);
      setLongitude(coords.lng);
      setAreaTitle("");
      setZoneOptions([]);
    }
  };

  // Shorten zone address for store display
  const getShortAddress = (address) => {
    if (typeof address !== "string") return "";
    const parts = address.split(",");
    return parts.length > 1 ? `${parts[0]},${parts[1]}` : address;
  };

  const handleSave = async () => {
    try {
      if (!city) {
        alert("Please select a city");
        return;
      }
      if (!areaTitle) {
        alert("Please enter/select a zone");
        return;
      }
      const payload = {
        city: city.city,
        address: areaTitle,
        latitude,
        longitude,
        range: range * 1000,
        storeId: storeId || "",
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
      alert("Error saving area.");
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
      <div style={{ padding: "20px", maxWidth: "80%", margin: "0 auto", fontFamily: "Arial" }}>
        <h2 style={{ textAlign: "center", color: "green", marginBottom: "40px" }}>ADD NEW ZONE</h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <label>City</label>
          <select style={{ width: "70%" }} onChange={handleCityChange} value={city?._id || ""}>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.city}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <label>Zone</label>
          <Autocomplete
            freeSolo
            options={zoneOptions}
            getOptionLabel={(option) => option.label || ""}
            onInputChange={(e, newInputValue) => setAreaTitle(newInputValue)}
            onChange={handleZoneSelect}
            renderInput={(params) => <TextField {...params} placeholder="Enter Zone" fullWidth />}
            style={{ width: "70%" }}
            inputValue={areaTitle}
          />
        </div>

        {/* Introduction on the left, Map on the right */}
        <div style={{ display: "flex", flexDirection: "row", gap: "30px", marginBottom: "30px" }}>
          {/* Introduction Section with Steps */}
          <div style={{ flex: "1", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h3 style={{ color: "#333", marginBottom: "15px" }}>Steps to Add a New Service Area</h3>
            <ul style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: "1.5", color: "#555" }}>
              <li style={{ marginBottom: "10px" }}>
                <strong>Step 1:</strong> Select a city for the service area from the dropdown.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Step 2:</strong> Search for a zone in the search box and view its location on the map.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Step 3:</strong> Set the range for the service area using the slider.
              </li>
              <li>
                <strong>Step 4:</strong> Click Save Service Area to add the zone to your system.
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div
            style={{
              flex: "2",
              height: "375px",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <GoogleMap mapContainerStyle={mapContainerStyle} center={markerPosition} zoom={13}>
              <Marker position={markerPosition} />
              <Circle
                center={markerPosition}
                radius={range * 1000}
                options={{
                  strokeColor: "red",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "red",
                  fillOpacity: "0.2",
                }}
              />
            </GoogleMap>
          </div>
        </div>

        {/* Store Selection
        {areaTitle && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
            <label>Store</label>
            {stores.length > 0 ? (
              <select
                style={{ width: "70%" }}
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
              >
                <option value="">--Select Store--</option>
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name} ({getShortAddress(store.zoneAddress)})
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ color: "gray", width: "70%" }}>
                No stores available for this city.
              </span>
            )}
          </div>
        )} */}

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
          style={{ marginTop: "20px", backgroundColor: "#00c853" }}
          onClick={handleSave}
        >
          <h4 style={{ color: "white", fontSize: "15px" }}>Save Service Area</h4>
        </Button>
      </div>
    </MDBox>
  );
}

export default AddServiceArea;