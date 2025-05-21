import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function AddBanner() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [zoneInput, setZoneInput] = useState("");
  const [zones, setZones] = useState([]);
  const [locations, setLocations] = useState([]);
  const [type, setType] = useState('');
  const [main, setMain] = useState([]);
  const [mainId, setMainId] = useState('')
  const [subId, setSubId] = useState('')

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

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getMainCategory");
        const data = await res.json();
        setMain(data.result);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchCategories();

    const getCity = async () => {
            try {
                const result = await fetch("https://node-m8jb.onrender.com/getcitydata");
                const data = await result.json();
                setCities(citiesWithStatus);
            } catch (err) {
                console.log(err);
            }
        };
        getCity();
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

  const allSubCategories = main.flatMap(cat => cat.subcat || []);
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

        {/* Type */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500" }}>City</label>
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
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">--Select City--</option>
            {cities.map((item,index)=>{
              <option key={item._id} value={item.name}>{item.name}</option>
            })}
          </select>
        </div>

        {/* Select Zone with Autocomplete */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <label style={{ fontWeight: "500", marginLeft: "15px" }}>Select Zone</label>
          <div style={{ width: "52.5%" }}>
            <select
              value={zoneInput}
              onChange={(e) => {
                const selectedAddress = e.target.value;
                if (selectedAddress && !zones.includes(selectedAddress)) {
                  setZones([...zones, selectedAddress]);
                }
                setZoneInput(""); // Reset input after selection
              }}
              style={{
                width: "96%",
                height: "45px",
                padding: "8px",
                borderRadius: "10px",
                border: "0.5px solid black",
                backgroundColor: "white"
              }}
            >
              <option value="">-- Select Zone --</option>
              {[...locations]
                .sort((a, b) => a.address.localeCompare(b.address))
                .map((loc, idx) => (
                  <option key={idx} value={loc.address}>
                    {loc.address}
                  </option>
                ))}
            </select>

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
                  {getShortAddress(zone)}
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
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">--Select Type--</option>
            <option value="Category">Category</option>
            <option value="SubCategory">Sub-Category</option>
            <option value="Sub Sub-Category">Sub Sub-Category</option>
          </select>
        </div>


        {/* Category */}

        {type === 'Category' ? (
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "25px"
          }}>
            <label style={{ fontWeight: "500" }}>Select Category</label>
            <select
              style={{
                width: "50%",
                height: '45px',
                padding: "8px",
                borderRadius: "10px",
                border: '0.5px solid black',
                backgroundColor: 'white',
                marginRight: '30px'
              }}
              value={mainId}
              onChange={(e) => setMainId(e.target.value)}
            >
              {main.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
        ) : type === 'SubCategory' ? (
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "25px"
          }}>
            <label style={{ fontWeight: "500" }}>Select Category</label>
            <select
              style={{
                width: "50%",
                height: '45px',
                padding: "8px",
                borderRadius: "10px",
                border: '0.5px solid black',
                backgroundColor: 'white',
                marginRight: '30px'
              }}
              value={subId}
              onChange={(e) => setSubId(e.target.value)}
            >
              {allSubCategories.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
        ) : null
        }

        {/* Submit Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: "50px",
          marginTop: '50px'
        }}>
          <Button style={{
            width: '110px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#00c853',
            color: 'white',
            fontWeight: '600',
            fontSize: '18px',
            cursor: 'pointer',
          }}>
            SUBMIT
          </Button>
          <Button style={{
            width: '110px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'gray',
            color: 'white',
            fontWeight: '600',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: "30px"
          }} onClick={() => navigate(-1)}>
            BACK
          </Button>
        </div>
      </div>
    </MDBox>
  );
}

export default AddBanner;
