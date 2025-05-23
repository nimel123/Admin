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
  const [subsubId,setSubsubId]=useState('');
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
    fetchLocations();

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getMainCategory");
        if (res.status === 200) {
          const data = await res.json();
          setMain(data.result);
          console.log(data.result);
        }
        else {
          alert('Try Again')
        }

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
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

  const handleBanner = async () => {
    // try{
    //   const reset=await fetch('https://fivlia.onrender.com/banner',{
    //     method:'POST'
    //   })
    // }
    // catch(err){
    //   console.log(err);   
    // }
  }

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
                  width: "238px",
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

        {selectedCity ? (
          <div style={formRowStyle}>
            <label style={labelStyle}>Select Zone</label>
            <div style={{ width: "50%", marginRight: '20px', position: "relative" }}>
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
        ) : null
        }



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

        {type === "Category" && (
          <div style={formRowStyle}>
            <label style={labelStyle}>Select Category</label>
            <select
              style={{ ...inputStyle, marginRight: "30px" }}
              value={mainId}
              onChange={(e) => setMainId(e.target.value)}
            >
              <option value="">--Select Category--</option>
              {main.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "SubCategory" && (
          <>
            <div style={formRowStyle}>
              <label style={labelStyle}>Main Category</label>
              <select
                style={{ ...inputStyle, marginRight: "30px" }}
                value={mainId}
                onChange={(e) => {
                  setMainId(e.target.value);
                  setSubId("");
                }}
              >
                <option value="">--Select Main Category--</option>
                {main.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {mainId && (
              <div style={formRowStyle}>
                <label style={labelStyle}>Sub Category</label>
                <select
                  style={{ ...inputStyle, marginRight: "25px" }}
                  value={subId}
                  onChange={(e) => setSubId(e.target.value)}
                >
                  <option value="">--Select Sub Category--</option>
                  {(main.find((cat) => cat._id === mainId)?.subcat || []).map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {type === "Sub Sub-Category" && (
          <>
            <div style={formRowStyle}>
              <label style={labelStyle}>Main Category</label>
              <select
                style={{ ...inputStyle, marginRight: "30px" }}
                value={mainId}
                onChange={(e) => {
                  setMainId(e.target.value);
                  setSubId("");
                }}
              >
                <option value="">--Select Main Category--</option>
                {main.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {mainId && (
              <div style={formRowStyle}>
                <label style={labelStyle}>Sub Category</label>
                <select
                  style={{ ...inputStyle, marginRight: "30px" }}
                  value={subId}
                  onChange={(e) => setSubId(e.target.value)}
                >
                  <option value="">--Select Sub Category--</option>
                  {(main.find((cat) => cat._id === mainId)?.subcat || []).map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subId && (
              <div style={formRowStyle}>
                <label style={labelStyle}>Sub Sub Category</label>
                <select
                  style={{ ...inputStyle, marginRight: "40px" }}
                  value={subsubId}
                  onChange={(e) => setSubsubId(e.target.value)}
                >
                  <option value="">--Select Sub Sub Category--</option>
                  {(main
                    .find((cat) => cat._id === mainId)
                    ?.subcat.find((sub) => sub._id === subId)?.subsubcat || []
                  ).map((subsub) => (
                    <option key={subsub._id} value={subsub._id}>
                      {subsub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}


        {/* Submit Button */}
        <div style={{display:'flex',gap:'50px',justifyContent:'center',alignItems:'center',marginTop:'50px' }}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#00c853', color: 'white' }}
            onClick={handleBanner}
          >
            SAVE
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: '#00c853', color: 'white' }}
            onClick={()=>navigate(-1)}
          >
            BACK
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
