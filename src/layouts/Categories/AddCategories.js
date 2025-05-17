import React, { useState } from "react";
import "./Addcategories.css";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

const AddCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [type, setType] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const navigate=useNavigate();

  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = () => {
    if (
      !categoryName ||
      !description ||
      !image ||
      !type ||
      (type === "Sub Category" && !mainCategory) ||
      (type === "Sub Sub-Category" && !subCategory)
    ) {
      alert("Please fill all fields!");
      return;
    }

    const formData = {
      categoryName,
      description,
      image,
      type,
      mainCategory: type === "Sub Category" ? mainCategory : null,
      subCategory: type === "Sub Sub-Category" ? subCategory : null,
    };

    console.log("Submitted Data:", formData);

    // Reset form
    setCategoryName("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setType("");
    setMainCategory("");
    setSubCategory("");
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "20px" }}>
      <div style={{
        width: "85%",
        margin: "0 auto",
        borderRadius: "10px",
        padding: "10px",
        border:'1px solid gray',
         boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "30px",fontWeight:'bold',color:'green' }}>ADD NEW CATEGORY</h2>

        {/* Category Name */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div><label style={{fontWeight:'500'}}>Category Name</label></div>
          <div style={{ width: "59.5%" }}>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{border:'1px solid black',backgroundColor:'white'}}
            />
          </div>
        </div>

        {/* Category Image */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
          <div><label style={{fontWeight:'500'}}>Category Image</label></div>
          <div style={{ width: "36%" }}>
            <input type="file" accept="image/*" onChange={handleImageChange} 
            style={{border:'1px solid black',backgroundColor:'white'}}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "-30px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#666",
                }}
              >
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div><label style={{fontWeight:'500'}}>Description</label></div>
          <div style={{ width: "59%", marginLeft: "45px" }}>
            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", height: "100px",borderRadius:'10px',padding:'5px' }}
            />
          </div>
        </div>

        {/* Type */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
          <div><label style={{fontWeight:'500'}}>Type</label></div>
          <div style={{ width: "60%" }}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: "30px",backgroundColor:'white',border:'1px solid black' }}>
              <option value="">-- Select an option --</option>
              <option value="Main Category">Main Category</option>
              <option value="Sub Category">Sub Category</option>
              <option value="Sub Sub-Category">Sub Sub-Category</option>
            </select>
          </div>
        </div>

        {/* Main Category (only for Sub Category) */}
        {type === "Sub Category" && (
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
            <div><label style={{fontWeight:'500'}}>Select Main Category</label></div>
            <div style={{ width: "60%" }}>
              <select
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                style={{ marginLeft: "-8px",backgroundColor:'white',border:'1px solid black' }}
              >
                <option value="">-- Select Main Category --</option>
                <option value="Food">Food</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>
        )}

        {/* Sub Category (only for Sub Sub-Category) */}
        {type === "Sub Sub-Category" && (
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
            <div><label style={{fontWeight:'500'}}>Select Sub Category</label></div>
            <div style={{ width: "60%",marginLeft:'10px' }}>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                style={{ marginLeft: "-8px",backgroundColor:'white',border:'1px solid black' }}
              >
                <option value="">-- Select Sub Category --</option>
                <option value="Snacks">Snacks</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Mens Clothing">Mens Clothing</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ textAlign: "center",}}>
          <button onClick={handleSubmit} style={{ width:'80px',height:'40px', fontSize: "16px",marginTop:'10px',
            marginBottom:'20px',backgroundColor:'green',color:'white',borderRadius:'15px',marginRight:'50px',cursor:'pointer' }}
            >
            SAVE
          </button>
          <button onClick={()=>navigate(-1)} style={{ width:'80px',height:'40px', fontSize: "16px",marginTop:'10px',
            marginBottom:'20px',backgroundColor:'green',color:'white',borderRadius:'15px',cursor:'pointer' }}
            
            >
            BACK
          </button>
        </div>
      </div>
    </MDBox>
  );
};

export default AddCategories;
