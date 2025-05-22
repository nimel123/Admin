import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function AddBanner() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [zoneInput, setZoneInput] = useState("");
  const [zones, setZones] = useState([]);
  const [locations, setLocations] = useState([]);
  const [main, setMain] = useState([]);
  const [type, setType] = useState("");
  const [mainId, setMainId] = useState("");
  const [subId, setSubId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getlocations");
        const data = await res.json();
        setLocations(data.result || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getMainCategory");
        const data = await res.json();
        setMain(data.result || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  const ImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveZone = (zone) => {
    setZones(zones.filter((z) => z !== zone));
  };

  const getShortAddress = (fullAddress) => {
    const parts = fullAddress.split(",");
    return parts.length > 1 ? `${parts[0]},${parts[1]}` : fullAddress;
  };

  const selectedCity = locations.find((loc) => loc._id === selectedCityId);
  const cityZones = selectedCity ? selectedCity.zones : [];

  return (
    <MDBox
      p={2}
      style={{
        marginLeft: miniSidenav ? "80px" : "250px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <div
        style={{
          width: "95%",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid gray",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "green",
            fontWeight: "bold",
            marginBottom: "50px",
          }}
        >
          ADD NEW BANNER
        </h2>

        {/* Name */}
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            placeholder="Enter Banner Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Image */}
        <div style={formRowStyle}>
          <label style={labelStyle}>Image</label>
          <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
            <input
              type="file"
              onChange={ImagePreview}
              style={{ ...inputStyle, marginRight: "20px" }}
            />
            {image && (
              <img
                src={image}
                alt="preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>
        </div>

        {/* City */}
        <div style={formRowStyle}>
          <label style={labelStyle}>City</label>
          <select
            style={inputStyle}
            value={selectedCityId}
            onChange={(e) => {
              setSelectedCityId(e.target.value);
              setZones([]);
            }}
          >
            <option value="">-- Select City --</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.city}
              </option>
            ))}
          </select>
        </div>

        {/* Zone Selection */}
        <div style={formRowStyle}>
          <label style={labelStyle}>Select Zone</label>
          <div style={{ width: "50%",marginRight:'20px', position: "relative" }}>
            <select
              value={zoneInput}
              onChange={(e) => {
                const selectedAddress = e.target.value;
                if (selectedAddress && !zones.includes(selectedAddress)) {
                  setZones([...zones, selectedAddress]);
                }

                // Defer clearing the dropdown to after rendering
                setTimeout(() => setZoneInput(""), 100);
              }}
              style={{
                ...inputStyle,
                width: "100%",
              }}
            >
              <option value="">-- Select Zone --</option>
              {cityZones.map((zone, idx) => (
                <option key={idx} value={zone.address}>
                  {zone.address}
                </option>
              ))}
            </select>

            {/* Tags */}
            <div style={tagsContainerStyle}>
              {zones.map((zone, index) => (
                <span
                  key={index}
                  onClick={() => handleRemoveZone(zone)}
                  style={tagStyle}
                  title={zone}
                >
                  {getShortAddress(zone)}
                </span>
              ))}
            </div>
          </div>
        </div>


        {/* Type */}
        <div style={formRowStyle}>
          <label style={labelStyle}>Type</label>
          <select
            style={inputStyle}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">--Select Type--</option>
            <option value="Category">Category</option>
            <option value="SubCategory">Sub-Category</option>
            <option value="Sub Sub-Category">Sub Sub-Category</option>
          </select>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            style={{backgroundColor:'#00c853',color:'white'}}
            onClick={() => alert("Submit clicked")}
          >
            Submit
          </Button>
        </div>
      </div>
    </MDBox>
  );
}

// ✅ Reusable styles
const formRowStyle = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  marginBottom: "25px",
};

const labelStyle = {
  fontWeight: "500",
};

const inputStyle = {
  width: "50%",
  height: "45px",
  padding: "8px",
  borderRadius: "10px",
  border: "0.5px solid black",
  backgroundColor: "white",
};

const tagsContainerStyle = {
  marginTop: "10px",
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const tagStyle = {
  backgroundColor: "#f0f0f0",
  padding: "6px 10px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "14px",
  color: 'black'
};

export default AddBanner;
