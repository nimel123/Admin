import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

function AddBanner() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [zoneInput, setZoneInput] = useState("");
  const [zones, setZones] = useState([]);
  const [locations, setLocations] = useState([]);

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

    fetchLocations();
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

  return (
    <MDBox
      p={2}
      style={{
        marginLeft: miniSidenav ? "80px" : "250px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <div style={{
        width: "95%",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid gray"
      }}>
        <h2 style={{
          textAlign: "center",
          color: "green",
          fontWeight: "bold",
          marginBottom: '50px',
        }}>ADD NEW BANNER</h2>

        {/* Name */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500" }}>Name</label>
          <input
            type="text"
            placeholder="Enter Banner Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "50%",
              padding: "10px",
              borderRadius: "10px",
              border: '0.5px solid black',
              backgroundColor: 'white',
              height: '45px'
            }}
          />
        </div>

        {/* Image */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500" }}>Image</label>
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "50%"
          }}>
            <input
              type="file"
              onChange={ImagePreview}
              style={{
                width: "100%",
                height: '45px',
                borderRadius: '10px',
                marginRight: "20px",
                border: '0.5px solid black',
                backgroundColor: 'white'
              }}
            />
            {image && (
              <img
                src={image}
                alt="preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            )}
          </div>
        </div>

        {/* Select Zone with Autocomplete */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500", marginTop: "8px", marginLeft: '15px' }}>Select Zone</label>
          <div style={{ width: "52.5%", position: "relative" }}>
            <input
              type="text"
              placeholder="Search and press Enter"
              value={zoneInput}
              onChange={(e) => setZoneInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && zoneInput.trim()) {
                  e.preventDefault();
                  const matched = locations.find(loc =>
                    loc.address.toLowerCase() === zoneInput.toLowerCase()
                  );
                  if (matched && !zones.includes(matched.address)) {
                    setZones([...zones, matched.address]);
                    setZoneInput("");
                  }
                }
              }}
              style={{
                width: "95%",
                height: '45px',
                padding: "8px",
                borderRadius: "10px",
                border: '0.5px solid black',
                backgroundColor: 'white'
              }}
            />

            {/* Suggestions */}
            {zoneInput && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "95%",
                maxHeight: "150px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "0 0 10px 10px",
                zIndex: 1000
              }}>
                {locations
                  .filter(loc =>
                    loc.address.toLowerCase().includes(zoneInput.toLowerCase())
                  )
                  .map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (!zones.includes(loc.address)) {
                          setZones([...zones, loc.address]);
                        }
                        setZoneInput("");
                      }}
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        fontSize: "12px",
                      }}
                    >
                      {loc.address}
                    </div>
                  ))}
              </div>
            )}

            {/* Tags */}
            <div style={{
              marginTop: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              backgroundColor: 'white',
            }}>
              {zones.map((zone, index) => (
                <span
                  key={index}
                  onClick={() => handleRemoveZone(zone)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  title={zone}
                >
                  {getShortAddress(zone)} &times;
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Type */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500" }}>Type</label>
          <select
            style={{
              width: "50%",
              height: '45px',
              padding: "8px",
              borderRadius: "10px",
              border: '0.5px solid black',
              backgroundColor: 'white',
              marginLeft: '10px'
            }}
          >
            <option value="">--Select Type--</option>
            <option value="Category">Category</option>
            <option value="SubCategory">Sub-Category</option>
            <option value="Sub Sub-Category">Sub Sub-Category</option>
          </select>
        </div>

        {/* Submit Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: "50px",
          marginTop: '50px'
        }}>
          <button style={{
            width: '150px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'skyblue',
            color: 'black',
            fontWeight: '600',
            fontSize: '18px',
            cursor: 'pointer',
          }}>
            SUBMIT
          </button>
          <button style={{
            width: '150px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'skyblue',
            color: 'black',
            fontWeight: '600',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft:"30px"
          }} onClick={()=>navigate(-1)}>
            BACK
          </button>
        </div>
      </div>
    </MDBox>
  );
}

export default AddBanner;
