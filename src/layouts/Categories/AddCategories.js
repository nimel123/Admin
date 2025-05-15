import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import "./Addcategories.css";
import { useNavigate } from "react-router-dom";
import Zone from '../Zones/HisarZone';

function AddCategories() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [controller] = useMaterialUIController();
  const [selectedValue, setSelectedValue] = useState('');
  const { miniSidenav } = controller;
  const navigate = useNavigate();
  const [subcategoryName, setSubcategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [city, setCity] = useState('');
  const [zone, setZone] = useState('');
  const [arrayZone, setArrayZone] = useState([]);
  const [datacity, setDatacity] = useState([]);

  useEffect(() => {
    const getcitydata = async () => {
      const result = await fetch('https://node-m8jb.onrender.com/getcitydata');
      const json = await result.json();
      setDatacity(json);
    };

    getcitydata();
  }, []);

  const ManageData = async () => {
    if (!name || !description || !file || subcategories.length === 0) {
      return alert('Please Check All Fields');
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("file", file);

      const subcatData = subcategories.map(({ name, price }) => ({ name, price }));
      formData.append("subcat", JSON.stringify(subcatData));

      subcategories.forEach((sub) => {
        formData.append("subImages", sub.file);
      });
      formData.append("city", city);
      formData.append("zones", JSON.stringify(arrayZone));


      const result = await fetch("https://node-m8jb.onrender.com/addcategories", {
        method: "POST",
        body: formData,
      });

      if (result.status === 200) {
        alert("Category Created Successfully");
        navigate('/categories');
      } else {
        alert("Failed to Create Category");
      }
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Something went wrong");
    }
  };

  function Home() {
    return navigate('/categories');
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleAddSubcategory = () => {
    if (!subcategoryName || !price || !imageFile) {
      return alert("Please fill all subcategory fields.");
    }

    const newSub = {
      name: subcategoryName,
      price: price,
      file: imageFile,
    };

    setSubcategories([...subcategories, newSub]);
    setSubcategoryName('');
    setPrice('');
    setImageFile(null);
  };

  const handleZone = () => {
    if (zone && !arrayZone.includes(zone)) {
      setArrayZone([...arrayZone, zone]);
      setZone(""); 
    } else {
      alert("Zone already added or invalid.");
    }
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
      <h1 style={{ textAlign: "center", marginTop: "20px", fontFamily: "Urbanist" }}>
        Categories Management
      </h1>
      <div className="category-container">
        <h2 className="category-title">CREATE CATEGORY</h2>

        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Insert Name" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Insert Description" onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" accept=".svg" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Select City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%',  }}>
            <option value="">-- Select City --</option>
            {datacity.map((item, index) => (
              <option key={index} value={item.city}>
                {item.city}
              </option>
            ))}
          </select>
        </div>

        {city && (
          <div className="form-group">
            <label>Select Zone</label>
            {city === "Hisar" ? (
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                style={{ width: "100%", height: "30px" }}
              >
                <option value="">-- Select Zone --</option>
                {Zone.map((zoneItem, index) => (
                  <option key={index} value={zoneItem}>
                    {zoneItem}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: "red", fontSize: "14px" }}>
                No zone available in this city
              </p>
            )}
          </div>
        )}

        {zone && (
          <button onClick={handleZone} style={{ marginTop: '10px' }}>
            Add
          </button>
        )}

        {arrayZone.length > 0 && (
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Zone List</label>
            <select>
              {arrayZone.map((z, index) => (
                <option key={index}>{z}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Manage Categories</label>
          <select value={selectedValue} onChange={handleChange} style={{ width: '130px', }}>
            <option value="">-- Select --</option>
            <option value="Categories">Categories</option>
            <option value="Sub-Categories">Sub-Categories</option>
          </select>
        </div>

        {selectedValue === 'Sub-Categories' && (
          <>
            <div className="form-group">
              <label>Subcategory Name</label>
              <input
                type="text"
                placeholder="e.g. Ice Cream"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <button onClick={handleAddSubcategory}>Add</button>

            {subcategories.length > 0 && (
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Subcategories List</label>
                <select>
                  {subcategories.map((sub, index) => (
                    <option key={index}>
                      {sub.name} - ₹{sub.price}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <div className="button-group">
          <button className="save-btn" onClick={ManageData}>Save</button>
          <button className="back-btn" onClick={Home}>Back</button>
        </div>
      </div>
    </MDBox>
  );
}

export default AddCategories;
