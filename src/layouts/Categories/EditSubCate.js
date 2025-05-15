import React, { useState } from "react";
import './ProductFrom.css';
import { Box } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EditSub = () => {
     const location = useLocation();
        const category = location.state;
        console.log(category);
        
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState({ size: '', weight: '' });
      const navigate=useNavigate();

    const handleAttributeSelect = (e) => {
        const value = e.target.value;
        if (value && !selectedAttributes.includes(value)) {
            setSelectedAttributes([...selectedAttributes, value]);
        }
    };

    const handleAttributeChange = (key, val) => {
        setAttributeValues({ ...attributeValues, [key]: val });
    };

    const getVariantLabel = () => {
        const { size, weight } = attributeValues;
        if (size && weight) return `${size}-${weight}`;
        return size || weight || '';
    };

    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setSelectedImages(imageUrls);
    };

    function back(){
        navigate(-1);
    }

    return (
        <Box sx={{ ml: { xs: "0", md: "250px" }, p: 2, marginTop: "50px" }}>
            <div className="form-container">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Insert Name" defaultValue="5 Star" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input type="number" placeholder="Insert Price" defaultValue="30" />
                </div>
                <div className="form-group">
                    <label>Discount Price</label>
                    <input type="number" placeholder="Insert Discount Price" defaultValue="0" />
                </div>
                <div className="form-group">
                    <label>Store</label>
                    <select>
                        <option>Select Store</option>
                        <option>Store A</option>
                        <option>Store B</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select>
                        <option>Fruits & Vegetables</option>
                        <option>Dairy</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Item Quantity</label>
                    <input type="number" placeholder="For unlimited set -1" defaultValue="-1" />
                </div>

                <div className="section-title">Item Attributes</div>

                <div className="form-group">
                    <select onChange={handleAttributeSelect} defaultValue="" style={{ marginTop: 22 }}>
                        <option value="" disabled>Select Attribute</option>
                        <option value="size">Size</option>
                        <option value="weight">Weight</option>
                    </select>
                </div>

                {selectedAttributes.includes("size") && (
                    <div className="form-group">
                        <label>Size</label>
                        <input
                            type="text"
                            placeholder="Add attribute values"
                            value={attributeValues.size}
                            onChange={(e) => handleAttributeChange("size", e.target.value)}
                        />
                    </div>
                )}

                {selectedAttributes.includes("weight") && (
                    <div className="form-group">
                        <label>Weight</label>
                        <input
                            type="text"
                            placeholder="Add attribute values"
                            value={attributeValues.weight}
                            onChange={(e) => handleAttributeChange("weight", e.target.value)}
                        />
                    </div>
                )}

                {(attributeValues.size || attributeValues.weight) && (
                    <div className="variant-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Variant</th>
                                    <th>Variant Price</th>
                                    <th>Variant Quantity</th>
                                    <th>Variant Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{getVariantLabel()}</td>
                                    <td><input type="number" defaultValue="1" /></td>
                                    <td><input type="number" defaultValue="-1" /></td>
                                    <td><input type="file" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Image Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <label>Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`preview-${index}`}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div style={{ width: '100%' }}>
                    <label>Description</label>
                    <textarea
                        rows="5"
                        placeholder="Enter description"
                        defaultValue="5 Star"
                        className="textarea"
                    ></textarea>
                </div>

                {/* Publish */}
                <div className=".checkbox-group" style={{ width: '100%' }}>
                    <input type="checkbox" id="publish" defaultChecked style={{ transform: 'scale(1.3)' }} />
                    <span
                        htmlFor="publish"
                        style={{ fontSize: '19px', marginLeft: "10px" }}
                    >
                        Publish
                    </span>
                </div>

                <div className="button-group" >
                    <button className="save-btn">
                       Save
                    </button>
                    <button className="back-btn" onClick={back}>Back</button>
                </div>

            </div>
        </Box>
    );
};

export default EditSub;
