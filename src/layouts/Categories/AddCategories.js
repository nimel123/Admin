import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import "./Addcategories.css";
import { useNavigate } from "react-router-dom";

function AddCategories() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate=useNavigate()

  const ManageData = async () => {
    if(!name && !description && !file ){
        return alert('Please Check All Fields')
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("file", file);

      const result = await fetch("http://localhost:5000/addcategories", {
        method: "POST",
        body: formData,
      });

      if (result.status === 200) {
        alert("Success");
        navigate('/categories')
      } else {
        alert("Failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  function Home(){
    return navigate('/categories')
  }
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

        <div className="button-group">
          <button className="save-btn" onClick={ManageData}>Save</button>
          <button className="back-btn" onClick={Home}>Back</button>
        </div>
      </div>
    </MDBox>
  );
}

export default AddCategories;
