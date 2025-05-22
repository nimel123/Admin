import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import { Button } from "@mui/material";

function Product() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("");

    const sectionIds = ["basicinfo", "imagesection", "category-section", "citysection", "taxsection"];

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subsubCategories, setSubsubCategories] = useState([]);
    const [citydata, setCityData] = useState([]);
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
    const [showPopup, setShowPopup] = React.useState(false);
    const [addAttribute,setAddattribute]=useState('')

    // Categories
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');

    // City and Zone (Multi-select)
    const [city, setCity] = useState('');
    const [zone, setZone] = useState([]);

    // Attributes (Multi-select)
    const [attribute, setAttribute] = useState([]);
    const [attributeValue, setAttributeValue] = useState([]);

    // Tax
    const [tax, setTax] = useState('');
    const [taxType, setTaxType] = useState('');

    // Image Upload
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState("");

    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [attributedata, setAttributeData] = useState('');


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

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        setCategory(selectedId);
        setSubCategory(""); // reset sub-category
        setSubSubCategory(""); // reset sub-sub-category

        const selectedCat = categories.find(cat => cat._id === selectedId);
        if (selectedCat) {
            setSubCategories(selectedCat.subcat || []);
        } else {
            setSubCategories([]);
        }
    };

    const handleSubCategoryChange = (e) => {
        const selectedId = e.target.value;
        setSubCategory(selectedId);
        setSubSubCategory("");

        const selectedSub = subCategories.find(sub => sub._id === selectedId);
        if (selectedSub) {
            setSubsubCategories(selectedSub.subsubcat || []);
        } else {
            setSubsubCategories([]);
        }
    };

    const handleAttribute=async()=>{
        try{
           const result=await fetch('https://fivlia.onrender.com/addAtribute',{
            method:'POST',
            body:JSON.stringify({
                name:attribute
            }),
            headers:{
                'Content-Type':'application/json'
            }
           })
           if(result.status===200){
            alert('Attribute Success')
           }
           else{
            alert('Somthing Wrong')
           }
        }
        catch(err){
            console.log(err);          
        }
    }

    useEffect(() => {
        const getCategory = async () => {
            try {
                const result = await fetch('https://node-m8jb.onrender.com/getMainCategory');
                if (result.status === 200) {
                    const res = await result.json();
                    setCategories(res.result)
                }
                else {
                    console.log('Something wrong');
                }

            }
            catch (err) {
                console.log(err);
            }
        }
        getCategory()


        const getActiveCity = async () => {
            try {
                const result = await fetch('https://fivlia.onrender.com/getAllZone');
                if (result.status === 200) {
                    const res = await result.json();
                    setCityData(res)
                }
                else {
                    console.log('Something Wrong');
                }
            }
            catch (err) {
                console.log(err);

            }
        }
        getActiveCity();

        const fetchAttribute = async () => {
            try {
                const res = await fetch("https://fivlia.onrender.com/getAttributes");
                const data = await res.json();
                setAttribute(data);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };
        fetchAttribute();

        const sectionIds = [
            'basicinfo',
            'imagesection',
            'category-section',
            'citysection',
            'taxsection',
        ];

        const handleScroll = () => {
            let current = '';
            for (let id of sectionIds) {
                const section = document.getElementById(id);
                if (section) {
                    const { top } = section.getBoundingClientRect();
                    if (top <= 100) {
                        current = id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setCity(cityId);

        const selectedCity = citydata.find(item => item._id === cityId);
        if (selectedCity) {
            setZones(selectedCity.zones || []);
        } else {
            setZones([]);
        }
    };


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
                    <div className="background" id="basicinfo">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Basic Information</span>
                        <div className="row-section" >
                            <div className="input-container">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Name"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div className="input-container">
                                <label>Description</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Description"
                                    className="input-field"
                                    value={description}
                                    style={{ backgroundColor: 'white' }}
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
                                    style={{ backgroundColor: 'white' }}
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
                                    style={{ backgroundColor: 'white' }}
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
                                    style={{ backgroundColor: 'white' }}
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
                                    style={{ backgroundColor: 'white' }}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* <div className="row-section">
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
                        </div> */}
                    </div>

                    {/* Image Upload */}
                    <div className="background" id="imagesection">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Images</span>
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
                                        style={{ backgroundColor: 'white' }}
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

                    {/* Category Selection */}
                    <div className="background" id="category-section">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Category Selection</span>
                        <div className="row-section" style={{ flexDirection: 'column' }}>

                            <label>Select Category</label>
                            <select className="input-field" value={category} onChange={handleCategoryChange}>
                                <option value="">--Select Category--</option>
                                {categories.map(item => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))}
                            </select>

                            {category && (
                                <>
                                    <label>Select Sub-Category</label>
                                    <select className="input-field" value={subCategory} onChange={handleSubCategoryChange}>
                                        <option value="">--Select Sub-Category--</option>
                                        {subCategories.map(item => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                </>
                            )}


                            {subCategory && (
                                <>
                                    <label>Select Sub-Sub-Category</label>
                                    <select className="input-field" value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)}>
                                        <option value="">--Select Sub Sub-Category--</option>
                                        {subsubCategories.map((item, index) => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                        </div>
                    </div>

                    {/* City & Zone */}
                    <div className="background" id="citysection">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>City & Attribute</span>
                        <div className="row-section">
                            <div className="input-container">
                                <label>Select City</label>
                                <select className="input-field" value={city} onChange={handleCityChange}>
                                    <option value="">--Select City--</option>
                                    {citydata.map((item) => (
                                        <option key={item._id} value={item._id}>{item.city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-container">
                                <label>Select Zone</label>
                                <select className="input-field" value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                                    <option value="">--Select Zone--</option>
                                    {zones.map((zone, index) => (
                                        <option key={index} value={zone.address}>
                                            {zone.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row-section">
                            <div className="input-container">
                                <label>Select Attribute</label>
                                <select className="input-field" value={attributedata} onChange={(e) => setAttributeData(e.target.value)}>
                                    <option value="">--Select Attribute--</option>
                                    {
                                        attribute.map((item) => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </select>
    
                                    <h3
                                        style={{ fontSize: '12px', cursor: 'pointer', color: 'green', marginTop: '10px', marginLeft: '5px' }}
                                        onClick={() => setShowPopup(true)}
                                    >
                                        + ADD ATTRIBUTE
                                    </h3>

                                    {showPopup && (
                                        <div style={{
                                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                                            zIndex: 1000,
                                        }}>
                                            <div style={{
                                                background: 'white', padding: 20, borderRadius: 5, minWidth: 300
                                            }}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter attribute"
                                                    value={addAttribute}
                                                    onChange={(e) => setAddattribute(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    
                                                    <button onClick={handleAttribute}>Save</button>
                                                    <button onClick={() => setShowPopup(false)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                        <div style={{ padding: "10px", backgroundColor: "white", marginBottom: "10px" }}>
                            <strong>Selected Zones:</strong> {zone.join(", ")}
                        </div>

                        <div style={{ padding: "10px", backgroundColor: "white", marginBottom: '30px' }}>
                            <strong>Selected Attribute Values:</strong> {attributeValue.join(", ")}
                        </div>

                    </div>




                    {/* Tax Section */}
                    <div className="background" id="taxsection">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Product Taxes</span>
                        <div style={{ padding: '20px' }}>
                            <div className="input-container">
                                <label>CGST</label>
                            </div>

                            <div className="input-container">
                                <label>Precentage</label>
                                <select className="input-field" value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                                    <option value="">--Select Tax Precentage--</option>
                                    <option value="Inclusive">Inclusive</option>
                                    <option value="Exclusive">Exclusive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '20px' }} >
                            <div className="input-container">
                                <label>IGST</label>
                            </div>

                            <div className="input-container">
                                <label>Precentage</label>
                                <select className="input-field" value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                                    <option value="">--Select Tax Precentage--</option>
                                    <option value="Inclusive">Inclusive</option>
                                    <option value="Exclusive">Exclusive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div className="input-container">
                                <label>SGST</label>
                            </div>

                            <div className="input-container">
                                <label>Precentage</label>
                                <select className="input-field" value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                                    <option value="">--Select Tax Precentage--</option>
                                    <option value="Inclusive">Inclusive</option>
                                    <option value="Exclusive">Exclusive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div className="input-container">
                                <label>VAT</label>
                            </div>

                            <div className="input-container">
                                <label>Precentage</label>
                                <select className="input-field" value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                                    <option value="">--Select Tax Precentage--</option>
                                    <option value="Inclusive">Inclusive</option>
                                    <option value="Exclusive">Exclusive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#00c853', color: 'white', fontSize: '15px' }}
                        >
                            SAVE
                        </Button>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#00c853', color: 'white', fontSize: '15px' }}
                            onClick={() => alert("Submit clicked")}
                        >
                            BACK
                        </Button>
                    </div>
                </div>


                <div className="sidebar-container">
                    <span style={{ fontWeight: 'bold' }}>Product Information</span>

                    {[
                        { id: 'basicinfo', label: 'Basic Information' },
                        { id: 'imagesection', label: 'Image Section' },
                        { id: 'category-section', label: 'Category Section' },
                        { id: 'citysection', label: 'City Selection' },
                        { id: 'taxsection', label: 'Tax Information' },
                    ].map((item, index, array) => (
                        <div key={item.id} style={{ position: 'relative' }}>
                            {/* Dashed line from current dot to next */}
                            {index < array.length - 1 && (
                                <div
                                    className={`dashed-line ${activeSection === item.id || array[index + 1].id === activeSection ? 'active' : ''
                                        }`}
                                ></div>
                            )}

                            <a
                                href={`#${item.id}`}
                                className="sidebar-link-container"
                                style={{ textDecoration: 'none' }}
                            >
                                <span className={`dot ${activeSection === item.id ? 'active' : ''}`}></span>
                                <h5 className={`label-text ${activeSection === item.id ? 'active' : ''}`}>
                                    {item.label}
                                </h5>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </MDBox >
    );
}

export default Product;
