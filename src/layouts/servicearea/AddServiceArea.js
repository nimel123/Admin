import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Slider, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet'; 

import 'leaflet/dist/leaflet.css';  


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const latlng = e.latlng;
      setPosition([latlng.lat, latlng.lng]);

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then((res) => res.json())
        .then((data) => {
          const displayName = data.display_name || `Lat: ${latlng.lat}, Lng: ${latlng.lng}`;
          onLocationSelect(displayName);
        })
        .catch(() => {
          onLocationSelect(`Lat: ${latlng.lat}, Lng: ${latlng.lng}`);
        });
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>You selected here</Popup>
    </Marker>
  ) : null;
}

LocationMarker.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
};

function AddServiceArea() {
  const [range, setRange] = useState(3200); 
  const [areaTitle, setAreaTitle] = useState("");
  const position = [29.1492, 75.7217]; 

  const handleRangeChange = (_, newValue) => {
    setRange(newValue);
  };

  const handleSave = async() => {
      try{
          const result=await fetch('http://localhost:5000/addLocation',{
            method:"POST",
            body:JSON.stringify({
                address:areaTitle
            }),
            headers:{
                "Content-Type":"application/json"
            }
          })
          if(result.status===200){
              alert("Area Saved Successlly")
          }
      }
      catch(err){
        console.log(err)
      }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "650px", margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Service Area Management</h2>

      <label>Area Title / Name</label>
      <TextField
        fullWidth
        placeholder="Click on map to auto-fill"
        value={areaTitle}
        onChange={(e) => setAreaTitle(e.target.value)}
        style={{ margin: "10px 0 20px 0" }}
      />

      <label>Select Area</label>
      <div style={{ width: "100%", height: "250px", border: "1px solid #ccc", borderRadius: "10px", marginBottom: "20px" }}>
        <MapContainer center={position} zoom={13} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
          <LocationMarker onLocationSelect={setAreaTitle} />
        </MapContainer>
      </div>

      <label>Select Range</label>
      <Slider
        value={range}
        onChange={handleRangeChange}
        min={100}
        max={50000}
        valueLabelDisplay="auto"
        style={{ color: "#007bff", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>100 m</span>
        <span>{(range / 1000).toFixed(1)} km</span>
        <span>50 km</span>
      </div>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: "20px" }}
        onClick={handleSave}
      >
        <h4 style={{color:'black'}}>Save Service Area</h4>
      </Button>
    </div>
  );
}

export default AddServiceArea;
