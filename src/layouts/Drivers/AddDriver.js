import React, { useState } from "react";
import { Button, TextField, Switch, FormControlLabel } from "@mui/material";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

function AddDriver() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [driverName, setDriverName] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [mobileNo, setMobileNo] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("status", status);
    formData.append("image", image);
    formData.append(
      "address",
      JSON.stringify({
        mobileNo,
        locality,
        city,
      })
    );

    try {
      const response = await fetch("https://fivlia.onrender.com/driver", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Driver added successfully");
        navigate("/drivers");
      } else {
        alert(result.message || "Failed to add driver");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={3}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 600,
          margin: "auto",
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#00c853" }}>Add Driver</h2>

        <TextField
          label="Driver Name"
          fullWidth
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          margin="normal"
          required
        />

        <FormControlLabel
          control={
            <Switch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              color="primary"
            />
          }
          label="Status"
        />

        <TextField
          label="Mobile Number"
          fullWidth
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="Locality"
          fullWidth
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          label="City"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          margin="normal"
          required
        />

        <div style={{ margin: "20px 0" }}>
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ marginTop: 10 }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            style={{ minWidth: 100 }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "gray", color: "white", minWidth: 100 }}
            onClick={() => navigate("/drivers")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </MDBox>
  );
}

export default AddDriver;
