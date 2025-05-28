import React, { useState, useEffect } from "react";
import { TextField, Slider, Button, Autocomplete } from "@mui/material";
import { GoogleMap, Marker, Circle, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";

import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const libraries = ["places"];

function EditZone() {
    const location = useLocation();
    const { zone: initialZone } = location.state || {};
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [range, setRange] = useState(3.2);
    const [areaTitle, setAreaTitle] = useState("");
    const [zones, setZones] = useState([]);
    const [zone, setZone] = useState(null);
    const [markerPosition, setMarkerPosition] = useState({ lat: 29.1492, lng: 75.7217 });
    const [id, setId] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [zoneOptions, setZoneOptions] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDnXzpb-5ImxSpoTdmOWlAqBcjtnfw4QLU",
        libraries,
    });

    // Initialize form fields from initialZone prop if available
    useEffect(() => {
        if (initialZone) {
            setId(initialZone._id);
            setAreaTitle(initialZone.address || "");
            if (initialZone.latitude && initialZone.longitude) {
                setMarkerPosition({ lat: initialZone.latitude, lng: initialZone.longitude });
                setLatitude(initialZone.latitude);
                setLongitude(initialZone.longitude);
            }
            if (initialZone.range) {
                setRange(initialZone.range / 1000);
            }
        }
    }, [initialZone]);

    // Fetch zones and set selected zone from initialZone.zone if present
    useEffect(() => {
        async function fetchZones() {
            try {
                const res = await fetch("https://fivlia.onrender.com/getAviableCity");
                const data = await res.json();
                if (data && data.length > 0) {
                    setZones(data);

                    if (initialZone && initialZone.city) {
                        // Matching zone by city name in fetched zones list
                        const matchedZone = data.find(
                            (z) => z.city.toLowerCase() === initialZone.city.toLowerCase()
                        );
                        if (matchedZone) {
                            setZone(matchedZone);
                            const coords = { lat: matchedZone.latitude, lng: matchedZone.longitude };
                            setMarkerPosition(coords);
                            setLatitude(coords.lat);
                            setLongitude(coords.lng);
                            return; // stop here
                        }
                    }

                    // Default to first zone if no match found
                    const firstZone = data[0];
                    setZone(firstZone);
                    const coords = { lat: firstZone.latitude, lng: firstZone.longitude };
                    setMarkerPosition(coords);
                    setLatitude(coords.lat);
                    setLongitude(coords.lng);
                }
            } catch (err) {
                console.error("Failed to fetch zones", err);
                alert("Failed to load zones from API.");
            }
        }
        fetchZones();
    }, [initialZone]);

    const handleRangeChange = (_, newValue) => setRange(newValue);

    const handleZoneSearch = async (query) => {
        if (query.length < 3) return;

        try {
            const fullQuery = `${query}, ${zone?.city || ""}`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                fullQuery
            )}&limit=10`;

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
    }, [areaTitle, zone]);

    const handleZoneSelect = (event, newValue) => {
        if (newValue && newValue.lat && newValue.lng) {
            const coords = { lat: newValue.lat, lng: newValue.lng };
            setMarkerPosition(coords);
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            setAreaTitle(newValue.label);
        }
    };

    const handleZoneChange = (event) => {
        const selectedZone = zones.find((z) => z._id === event.target.value);
        if (selectedZone) {
            const coords = { lat: selectedZone.latitude, lng: selectedZone.longitude };
            setZone(selectedZone);
            setMarkerPosition(coords);
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            setAreaTitle("");
            setZoneOptions([]);
        }
    };

    const updateZone = async () => {
        const dataToSave = {
            city: zone?.city,          
            state: zone?.state,        
            address: areaTitle,
            latitude,
            longitude,
            range: range * 1000,        
        };
        console.log(dataToSave);
        
        try {
            const res = await fetch(`https://fivlia.onrender.com/updateZoneStatus/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSave),
            });

            if (res.ok) {
                alert("Zone updated successfully!");
                navigate(-1); 
            } else {
                alert("Failed to update zone");
            }
        } catch (error) {
            console.error("Error updating zone:", error);
            alert("Error updating zone.");
        }
    };

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Google Maps...</div>;

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
                <h2
                    style={{
                        textAlign: "center",
                        color: "green",
                        marginBottom: "40px",
                    }}
                >
                    EDIT ZONE
                </h2>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "30px",
                    }}
                >
                    <label>Zone</label>
                    <select
                        style={{ width: "70%" }}
                        onChange={handleZoneChange}
                        value={zone?._id || ""}
                    >
                        {zones.map((z) => (
                            <option key={z._id} value={z._id}>
                                {z.city}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "30px",
                    }}
                >
                    <label>Zone Address</label>
                    <Autocomplete
                        freeSolo
                        options={zoneOptions}
                        getOptionLabel={(option) => option.label || ""}
                        onInputChange={(e, newInputValue) => setAreaTitle(newInputValue)}
                        onChange={handleZoneSelect}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Enter Zone Address" fullWidth />
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
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition}
                        zoom={13}
                    >
                        <Marker position={markerPosition} />
                        <Circle
                            center={markerPosition}
                            radius={range * 1000}
                            options={{
                                strokeColor: "red",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "red",
                                fillOpacity: 0.2,
                            }}
                        />
                    </GoogleMap>
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

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>0.1 km</span>
                    <span>{range.toFixed(1)} km</span>
                    <span>50 km</span>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "20px", backgroundColor: "#00c853" }}
                    onClick={updateZone}
                >
                    <h4 style={{ color: "white", fontSize: "15px" }}>
                        Edit Service Area
                    </h4>
                </Button>
            </div>
        </MDBox>
    );
}

export default EditZone;
