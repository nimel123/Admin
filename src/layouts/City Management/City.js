import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import "./City.css";
import States from "./IndianState";
import Cities from "./Indiancities";
import haryanaCities from "./Indiancities";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RecenterMap({ latlng }) {
    const map = useMap();
    useEffect(() => {
        if (latlng) {
            map.setView(latlng, 12, { animate: true });
        }
    }, [latlng, map]);
    return null;
}
RecenterMap.propTypes = {
    latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function ClickHandler({ onClickLocation }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then((res) => res.json())
                .then((data) => {
                    const address = data.address || {};
                    const city = address.city || address.town || address.village || address.hamlet || "";
                    const state = address.state || "";
                    const displayName = data.display_name || "";
                    onClickLocation({ latlng: [lat, lng], city, state, displayName });
                })
                .catch((err) => console.error("Reverse geocoding failed:", err));
        },
    });
    return null;
}
ClickHandler.propTypes = {
    onClickLocation: PropTypes.func.isRequired,
};

function City() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [zones, setZones] = useState([]);

    const searchRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedCity("");
        setCityCoordinates(null);
        setSearchTerm("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
        setSearchTerm(city);
        setSuggestions([]);
        setShowSuggestions(false);

        if (city && selectedState) {
            const address = `${city}, ${selectedState}, India`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        setCityCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        setCityCoordinates(null);
                    }
                })
                .catch(() => setCityCoordinates(null));
        } else {
            setCityCoordinates(null);
        }
    };

    const handleAddCityZone = () => {
        if (!selectedCity || !selectedState || !cityCoordinates) return;

        const exists = zones.some(
            (zone) =>
                zone.lat === cityCoordinates[0] &&
                zone.lon === cityCoordinates[1]
        );
        if (exists) return;

        const newZone = {
            name: `${selectedCity}, ${selectedState}`,
            lat: cityCoordinates[0],
            lon: cityCoordinates[1],
        };
        setZones((prevZones) => [...prevZones, newZone]);
    };

    const handleMapClick = ({ latlng, city, state, displayName }) => {
        setCityCoordinates(latlng);
        setSelectedCity(city);
        setSelectedState(state);
        setSearchTerm(displayName);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const cityList =
        selectedState === "Haryana" ? haryanaCities : selectedState ? Cities[selectedState] || [] : [];

    useEffect(() => {
        if (selectedCity && selectedState) {
            const address = `${selectedCity}, ${selectedState}, India`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        setCityCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        setCityCoordinates(null);
                    }
                })
                .catch(() => setCityCoordinates(null));
        }
    }, [selectedCity, selectedState]);

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "40px" }}>
            <div className="city-container">
                <h1>City Management</h1>
                <div className="add-city-box">
                    <h2>Add City</h2>
                    {/* Select State */}
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Select State</label>
                        <select value={selectedState} onChange={handleStateChange}>
                            <option value="">-- Select State --</option>
                            {States.map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select City and Add Button on same row, below State */}
                    {selectedState && (
                        <>
                            <div style={{ display:'flex',flexDirection:'row'}}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Select City</label>
                                    <select value={selectedCity} onChange={handleCityChange} style={{width:'92%'}}>
                                        <option value="">-- Select City --</option>
                                        {cityList.map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                    
                                <button
                                    onClick={handleAddCityZone}
                                    style={{
                                        height: "36px",
                                        padding: "0 12px",
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        marginTop:38,
                                        marginRight:26
                                    }}
                                >
                                    + Add City
                                </button>
                            </div>
                        </>
                    )}

                    {/* Zones */}
                    {zones.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Saved Zones</h3>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {zones.map((zone, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setZones((prevZones) => prevZones.filter((_, i) => i !== idx));
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            padding: "3px 6px",
                                            border: "1px solid #888",
                                            borderRadius: "5px",
                                            backgroundColor: "#e0e0e0",
                                            userSelect: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            whiteSpace: "nowrap",
                                            boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                                        }}
                                        title={zone.name}
                                    >
                                        <strong>{zone.name.split(",")[0]}</strong>
                                        <span style={{ color: "red", fontWeight: "bold" }}>×</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map */}
                    {cityCoordinates && (
                        <MapContainer
                            center={cityCoordinates}
                            zoom={12}
                            style={{ height: "400px", width: "100%", marginTop: "20px" }}
                        >
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
                            />
                            <TileLayer
                                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                                attribution="Labels &copy; Esri"
                            />
                            <Marker position={cityCoordinates}>
                                <Popup>{selectedCity}, {selectedState}</Popup>
                            </Marker>
                            <RecenterMap latlng={cityCoordinates} />
                            <ClickHandler onClickLocation={handleMapClick} />
                        </MapContainer>
                    )}
                </div>

                <div className="button-group" style={{ marginTop: "20px" }}>
                    <button className="save-btn">Save</button>
                    <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </MDBox>
    );
}

export default City;
