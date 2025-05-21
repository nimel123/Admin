import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import "./Product.css";

function Product() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subsubCategories, setSubsubCategories] = useState([]);
    const [citydata, setCityData] = useState([]);
    const [zonedata, setZoneData] = useState([]);
    const [attributedata, setAttributeData] = useState([]);
    const [taxdata, setTaxData] = useState([]);

    // Basic Product Info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [ribbon, setRibbon] = useState('');
    const [mrp, setMrp] = useState('');
    const [sellingprice, setSellingPrice] = useState('');
    const [minqty, setMinQty] = useState('');
    const [maxqty, setMaxQty] = useState('');

    // Categories
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');

    // City and Zone (Multi-select)
    const [city, setCity] = useState('');
    const [zone, setZone] = useState([]);

    // Attributes (Multi-select)
    const [attribute, setAttribute] = useState('');
    const [attributeValue, setAttributeValue] = useState([]);

    // Tax
    const [tax, setTax] = useState('');
    const [taxType, setTaxType] = useState('');

    // Image Upload
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 500 * 1024; // 500KB
        const maxImages = 4;

        const currentCount = selectedImages.length;
        const remainingSlots = maxImages - currentCount;

        const newImages = [];
        let rejected = false;
        let tooMany = false;

        files.forEach((file, index) => {
            if (index < remainingSlots) {
                if (file.size <= maxSize) {
                    const imageUrl = URL.createObjectURL(file);
                    newImages.push(imageUrl);
                } else {
                    rejected = true;
                }
            } else {
                tooMany = true;
            }
        });

        if (tooMany) {
            setError("Maximum 4 photos");
        } else if (rejected) {
            setError("Image size greater than 500KB");
        } else {
            setError("");
        }

        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const handleImageRemove = (indexToRemove) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleZoneChange = (e) => {
        const value = e.target.value;
        setZone((prev) =>
            prev.includes(value) ? prev.filter((z) => z !== value) : [...prev, value]
        );
    };

    const handleAttributeValueChange = (e) => {
        const value = e.target.value;
        setAttributeValue((prev) =>
            prev.includes(value)
                ? prev.filter((attr) => attr !== value)
                : [...prev, value]
        );
    };


    useEffect(() => {

          const getCategory=async()=>{
            try{
              const result=await fetch('https://node-m8jb.onrender.com/getMainCategory');
              const res=await result.json();
              setCategories(res.result)

            }
            catch(err){
                console.log(err);            
            }
          }
          getCategory()
    }, [])

    return (
        <MDBox
            p={2}
            style={{
                marginLeft: miniSidenav ? "80px" : "250px",
                transition: "margin-left 0.3s ease",
            }}
        >
            <div className="container">
                <div className="inner-view">
                    <h2 className="form-title">ADD NEW PRODUCT</h2>

                    {/* Product Name & Description */}
                    <div className="background">
                        <span style={{marginLeft:'20px',fontWeight:'bold',marginBottom:'10px'}}>Basic Information</span>
                    <div className="row-section" >
                        <div className="input-container">
                            <label>Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter Product Name"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{backgroundColor:'white'}}
                            />
                        </div>
                        <div className="input-container">
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="Enter Product Description"
                                className="input-field"
                                value={description}
                                style={{backgroundColor:'white'}}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row-section">
                        <div className="input-container">
                            <label>Product SKU</label>
                            <input
                                type="text"
                                placeholder="Enter Product SKU"
                                className="input-field"
                                value={sku}
                                style={{backgroundColor:'white'}}
                                onChange={(e) => setSku(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label>Ribbon</label>
                            <input
                                type="text"
                                placeholder="Enter Ribbon Text"
                                className="input-field"
                                value={ribbon}
                                style={{backgroundColor:'white'}}
                                onChange={(e) => setRibbon(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row-section">
                        <div className="input-container">
                            <label>Product MRP</label>
                            <input
                                type="text"
                                placeholder="Enter Product MRP"
                                className="input-field"
                                value={mrp}
                                style={{backgroundColor:'white'}}
                                onChange={(e) => setMrp(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label>Selling Price</label>
                            <input
                                type="text"
                                placeholder="Enter Product Selling Price"
                                className="input-field"
                                value={sellingprice}
                                style={{backgroundColor:'white'}}
                                onChange={(e) => setSellingPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    </div>

                    {/* Image Upload */}
                    <div className="background">
                          <span style={{marginLeft:'20px',fontWeight:'bold',marginBottom:'10px'}}>Images</span>
                    <div className="row-section">
                        <div style={{ display: 'flex', flexDirection: 'row' }} >
                            <div>
                                <label>Product Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="input-field"
                                    style={{backgroundColor:'white'}}
                                    disabled={selectedImages.length >= 4}
                                />
                                {error && <p style={{ color: "red", fontSize: '12px' }}>{error}</p>}
                            </div>
                            <div style={{
                                display: "flex",
                                overflowX: "auto",
                                gap: "10px",
                                marginTop: "10px",
                                marginLeft: '20px'
                            }}>
                                {selectedImages.map((image, index) => {
                                    const baseSize = 100;
                                    const shrinkFactor = Math.min(1, 5 / selectedImages.length);
                                    const size = baseSize * shrinkFactor;

                                    return (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`preview-${index}`}
                                            onClick={() => handleImageRemove(index)}
                                            title="Click to remove"
                                            style={{
                                                width: `${size}px`,
                                                height: `${size}px`,
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: "1px solid #ccc",
                                                cursor: "pointer",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* Quantity */}
                    <div className="background">
                    <div className="row-section">
                        <div className="input-container">
                            <label>Minimum Purchase Qty</label>
                            <input
                                type="number"
                                placeholder="Minimum Product Qty"
                                className="input-field"
                                value={minqty}
                                onChange={(e) => setMinQty(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label>Maximum Purchase Qty</label>
                            <input
                                type="number"
                                placeholder="Maximum Product Qty"
                                className="input-field"
                                value={maxqty}
                                onChange={(e) => setMaxQty(e.target.value)}
                            />
                        </div>
                    </div>
                    </div>

                    {/* Category Selection */}
                    <div className="background">
                         <span style={{marginLeft:'20px',fontWeight:'bold',marginBottom:'10px'}}>Category Selection</span>
                    <div className="row-section" style={{ flexDirection: 'column' }}>
                        <label>Select Category</label>
                        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">--Select Category--</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                        </select>

                        <label>Select Sub-Category</label>
                        <select className="input-field" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                            <option value="">--Select Sub-Category--</option>
                            <option value="mobile">Mobile</option>
                            <option value="clothing">Clothing</option>
                        </select>

                        <label>Select Sub-Sub-Category</label>
                        <select className="input-field" value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)}>
                            <option value="">--Select Sub Sub-Category--</option>
                            <option value="android">Android</option>
                            <option value="tshirt">T-Shirt</option>
                        </select>
                    </div>
                    </div>

                    {/* City & Zone */}
                    <div className="background">
                    <div className="row-section">
                        <div className="input-container">
                            <label>Select City</label>
                            <select className="input-field" value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="">--Select City--</option>
                                <option value="delhi">Delhi</option>
                                <option value="mumbai">Mumbai</option>
                            </select>
                        </div>

                        <div className="input-container">
                            <label>Select Zone (Multi)</label>
                            <select className="input-field" onChange={handleZoneChange}>
                                <option value="">--Select Zone--</option>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="East">East</option>
                                <option value="West">West</option>
                            </select>
                        </div>
                    </div>
                    </div>
                     
                     
                    <div style={{ padding: "10px", backgroundColor: "white", marginBottom: "10px" }}>
                        <strong>Selected Zones:</strong> {zone.join(", ")}
                    </div>
                   

                    {/* Attributes */}
                    <div className="background">
                    <div className="row-section">
                        <div className="input-container">
                            <label>Select Attribute</label>
                            <select className="input-field" value={attribute} onChange={(e) => setAttribute(e.target.value)}>
                                <option value="">--Select Attribute--</option>
                                <option value="Weight">Weight</option>
                                <option value="Size">Size</option>
                            </select>
                        </div>

                        <div className="input-container">
                            <label>Select Attribute Value (Multi)</label>
                            <select className="input-field" onChange={handleAttributeValueChange}>
                                <option value="">--Select Attribute Value--</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>
                    </div>
                    </div>

                    <div style={{ padding: "10px", backgroundColor: "white",marginBottom:'30px' }}>
                        <strong>Selected Attribute Values:</strong> {attributeValue.join(", ")}
                    </div>
                    

                    {/* Tax Section */}
                    <div className="background">
                    <div className="row-section" style={{  }}>
                        <div className="input-container">
                            <label>Product Taxes</label>
                            <select className="input-field" value={tax} onChange={(e) => setTax(e.target.value)}>
                                <option value="">--Select Tax--</option>
                                <option value="5%">5%</option>
                                <option value="12%">12%</option>
                            </select>
                        </div>

                        <div className="input-container">
                            <label>Tax Type</label>
                            <select className="input-field" value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                                <option value="">--Select Tax Type--</option>
                                <option value="Inclusive">Inclusive</option>
                                <option value="Exclusive">Exclusive</option>
                            </select>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </MDBox>
    );
}

export default Product;
