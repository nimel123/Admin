import React, { useEffect, useState } from "react";
import "./Addcategories.css";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

const EditCategory = () => {
  const [name, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [id, setId] = useState("");
  const [filter, setFilter] = useState([]);
  const [allFilters, setAllFilters] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState("");
  const [selectedFilterValues, setSelectedFilterValues] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const category = location.state;

  useEffect(() => {
    const getFilters = async () => {
      try {
        const result = await fetch(`https://fivlia.onrender.com/getFilter`);
        if (result.status === 200) {
          const res = await result.json();
          setAllFilters(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFilters();
  }, []);

  useEffect(() => {
    const getAttributes = async () => {
      try {
        const result = await fetch("https://fivlia.onrender.com/getAttributes");
        if (result.status === 200) {
          const res = await result.json();
          setAllAttributes(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAttributes();
  }, []);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
      setDescription(category.description || "");
      setImagePreview(category.image || null);
      setId(category._id);

      // Attributes
      setSelectedAttributes(Array.isArray(category.attribute) ? category.attribute : []);

      // Filters
      const formattedFilters = Array.isArray(category.filter)
        ? category.filter.map((f) => {
            const matched = allFilters.find((af) => af._id === f._id);
            return {
              _id: f._id,
              Filter_name: f.Filter_name || matched?.Filter_name || "Unknown",
              selected: f.selected || [], // selected values are required to render the tags
            };
          })
        : [];

      setFilter(formattedFilters);

      if (formattedFilters.length > 0) {
        setSelectedFilterId(formattedFilters[0]._id);
        setSelectedFilterValues(formattedFilters[0].selected);
      }
    } else {
      alert("No category data provided.");
      navigate(-1);
    }
  }, [category, allFilters, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(category.image || null);
    }
  };

  const handleFilterChange = (e) => {
    const filterId = e.target.value;
    setSelectedFilterId(filterId);

    const existingFilter = filter.find((f) => f._id === filterId);
    if (existingFilter) {
      setSelectedFilterValues(existingFilter.selected);
    } else {
      const selectedFilter = allFilters.find((f) => f._id === filterId);
      if (!selectedFilter) return;
      const newFilter = {
        _id: selectedFilter._id,
        Filter_name: selectedFilter.Filter_name,
        selected: selectedFilter.Filter || [],
      };
      setFilter((prev) => [...prev, newFilter]);
      setSelectedFilterValues(newFilter.selected);
    }
  };

  const handleRemoveFilter = (filterId) => {
    setFilter((prev) => prev.filter((f) => f._id !== filterId));
    if (selectedFilterId === filterId) {
      setSelectedFilterId("");
      setSelectedFilterValues([]);
    }
  };

  const handleRemoveTag = (filterId, tagId) => {
    setFilter((prevFilters) =>
      prevFilters.map((filt) =>
        filt._id === filterId
          ? {
              ...filt,
              selected: filt.selected.filter((val) => val._id !== tagId),
            }
          : filt
      )
    );
    if (selectedFilterId === filterId) {
      setSelectedFilterValues((prev) => prev.filter((val) => val._id !== tagId));
    }
  };

  const handleAttributeSelect = (e) => {
    const selectedAttr = e.target.value;
    if (selectedAttr && !selectedAttributes.includes(selectedAttr)) {
      setSelectedAttributes((prev) => [...prev, selectedAttr]);
    }
  };

  const handleRemoveAttribute = (attrName) => {
    setSelectedAttributes((prev) => prev.filter((a) => a !== attrName));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a valid name.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    // Only send filter IDs
    const simplifiedFilters = filter.map((f) => ({ _id: f._id }));
    formData.append("filter", JSON.stringify(simplifiedFilters));
    formData.append("attribute", JSON.stringify(selectedAttributes));

    try {
      const response = await fetch(`https://node-m8jb.onrender.com/edit-main-cat/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        navigate(-1);
      } else {
        const errorData = await response.json();
        alert(errorData.message || `Failed to update category (Status: ${response.status})`);
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Error updating category: " + err.message);
    }
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "20px" }}>
      <div style={{ width: "85%", margin: "0 auto", padding: "10px", border: "1px solid gray", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "center", color: "green", marginBottom: "30px" }}>EDIT CATEGORY</h2>

        {/* Category Name */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div><label>Category Name</label></div>
          <div style={{ width: "59.5%" }}>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={name}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
          <div><label>Category Image</label></div>
          <div style={{ width: "36%" }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100px", height: "100px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div><label>Description</label></div>
          <div style={{ width: "59%", marginLeft: "45px" }}>
            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", height: "100px", borderRadius: "10px" }}
            />
          </div>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px", marginLeft: '13px' }}>
          <div><label>Select Filters</label></div>
          <div style={{ width: "60%" }}>
            <select
              value={selectedFilterId}
              onChange={handleFilterChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            >
              <option value="" key="">-- Select Filter --</option>
              {allFilters.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.Filter_name || "Unnamed Filter"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attribute Dropdown */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div><label>Select Attribute</label></div>
          <div style={{ width: "59.5%" }}>
            <select
              value=""
              onChange={handleAttributeSelect}
              style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            >
              <option value="">-- Select Attribute --</option>
              {allAttributes.map((attr) => (
                <option key={attr._id || attr} value={attr.Attribute_name || attr}>
                  {attr.Attribute_name || attr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Filters with Values */}
        {filter.map((filt) => (
          <div key={filt._id} style={{ marginBottom: "15px", marginLeft: '60px', marginRight: '60px', }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>{filt.Filter_name}</strong>
              <Button style={{ color: 'black', fontSize: '14px' }} onClick={() => handleRemoveFilter(filt._id)}>Remove</Button>
            </div>
            {/* <div style={{
              marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '10px',
              border: '1px solid black', borderRadius: '10px',
            }}>
              {filt.selected.map((val) => (
                <div
                  key={val._id}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "white",
                    borderRadius: '10px',
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    marginTop: '10px',
                    marginLeft: '5px',
                    marginBottom: '10px'
                  }}
                >
                  <span>{val.name}</span>
                  <button
                    onClick={() => handleRemoveTag(filt._id, val._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

            </div> */}
          </div>
        ))}


        {/* Selected Attributes */}
        {selectedAttributes.length > 0 && (
          <div style={{ marginTop: "30px", marginLeft: "60px", marginRight: '60px', borderRadius: '10px' }}>
            <h4>Selected Attributes</h4>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px",
              border: "1px solid black", padding: "10px", borderRadius: "8px"
            }}>
              {selectedAttributes.map((attr) => (
                <div
                  key={attr}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "white",
                    borderRadius: '10px',
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px"
                  }}
                >
                  <span>{attr}</span>
                  <button
                    onClick={() => handleRemoveAttribute(attr)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Submit and Back Buttons */}
        <div style={{ textAlign: "center", marginTop: '30px' }}>
          <Button onClick={handleSubmit} style={{ backgroundColor: "#00c853", color: "white", marginRight: "20px" }}>EDIT</Button>
          <Button onClick={() => navigate(-1)} style={{ backgroundColor: "#00c853", color: "white" }}>BACK</Button>
        </div>
      </div>
    </MDBox>
  );
};

export default EditCategory;
