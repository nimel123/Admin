import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import "./City.css";
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

// Leaflet icon fix
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
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
                .then((res) => res.json())
                .then((data) => {
                    const address = data.address || {};
                    const city =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.hamlet ||
                        address.locality ||
                        address.municipality ||
                        address.state_district ||
                        "Unknown City";
                    const state = address.state || "Unknown State";
                    const fullAddress = data.display_name || "";

                    onClickLocation({
                        latlng: [lat, lng],
                        city,
                        state,
                        fullAddress,
                    });
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

    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                value
            )}&addressdetails=1`
        );
        const data = await res.json();
        setSuggestions(data);
    };

    const handleSelectSuggestion = (item) => {
        const { lat, lon, address, display_name } = item;
        const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            address.state_district ||
            "Unknown City";
        const state = address.state || "Unknown State";

        setSelectedCity(city);
        setSelectedState(state);
        setFullAddress(display_name);
        setSearchTerm(display_name);
        setCityCoordinates([parseFloat(lat), parseFloat(lon)]);
        setSuggestions([]);
    };

    const handleMapClick = ({ latlng, city, state, fullAddress }) => {
        setCityCoordinates(latlng);
        setSelectedCity(city);
        setSelectedState(state);
        setFullAddress(fullAddress);
        setSearchTerm(fullAddress);
        setSuggestions([]);
    };

    // New: Save handler to show data
    const handleSave = async () => {
        try {
            if (!cityCoordinates) {
                alert("Please select a city/location first!");
                return;
            }
            const dataToSave = {
                city: selectedCity,
                state: selectedState,
                fullAddress,
                latitude: cityCoordinates[0],
                longitude: cityCoordinates[1],
            };

            console.log(dataToSave);

            const result = await fetch('https://node-m8jb.onrender.com/addcitydata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSave)
            });

            if (result.status === 200) {
                navigate(-1)
                alert('Success')
            }
        }
        catch (err) {

        }


    };

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "40px" }}>
            <div className="city-container">
                <h2 style={{ textAlign: 'center', color: 'green', fontWeight: '500', marginTop: '-30px' }}>ADD CITY</h2>
                <div className="add-city-box">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                        <div>
                            <h3 style={{ textAlign: "center", marginLeft: '70px' }}>City</h3>
                        </div>
                        <div style={{ width: '33%', position: "relative", marginRight: '30px' }} ref={searchRef}>
                            <input
                                type="text"
                                placeholder="Search City"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestion-list">
                                    {suggestions.map((item, index) => (
                                        <li key={index} onClick={() => handleSelectSuggestion(item)}>
                                            {item.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Map Section */}
                    <div style={{ width: '70%', height: '400px', marginTop: '50px', display: 'flex', marginLeft: '180px' }}>
                        <MapContainer
                            center={cityCoordinates || [20.5937, 78.9629]}
                            zoom={cityCoordinates ? 12 : 4}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
                            />
                            <TileLayer
                                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                                attribution="Labels &copy; Esri"
                            />
                            {cityCoordinates && (
                                <>
                                    <Marker position={cityCoordinates}>
                                        <Popup>
                                            <strong>{selectedCity}</strong><br />
                                            {selectedState}<br />
                                            <small>{fullAddress}</small>
                                        </Popup>
                                    </Marker>
                                    <RecenterMap latlng={cityCoordinates} />
                                </>
                            )}
                            <ClickHandler onClickLocation={handleMapClick} />
                        </MapContainer>
                    </div>

                    {/* Buttons */}
                    <div className="button-group" style={{ marginTop: "20px" }}>
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </MDBox>
    );
}

export default City;
