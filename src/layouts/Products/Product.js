import React, { useEffect, useState, useRef } from "react"; // Added useRef
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import ColorNamer from "color-namer";
import { Button } from "@mui/material";

function Product() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("");
    const [variantPrices, setVariantPrices] = useState({});
    const [colorHexCodes, setColorHexCodes] = useState({});
    const [colorError, setColorError] = useState("");
    const [activeVariant, setActiveVariant] = useState("");

    const sectionIds = ["basicinfo", "imagesection", "category-section", "citysection", "taxsection"];

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subsubCategories, setSubsubCategories] = useState([]);
    const [citydata, setCityData] = useState([]);

    // Basic Product Info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [ribbon, setRibbon] = useState('');
    const [mrp, setMrp] = useState('');
    const [sellingprice, setSellingPrice] = useState('');
    const [minqty, setMinQty] = useState('');
    const [maxqty, setMaxQty] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showVariantPopup, setShowVariantPopup] = useState(false);
    const [showUnitPopup, setShowUnitPopup] = useState(false);
    const [showbrandPopup, setShowbrandPopup] = useState(false);
    const [addAttribute, setAddattribute] = useState('');
    const [addVarient, setAddVarient] = useState('');
    const [addUnit, setAddUnit] = useState('');
    const [addBrand, setBrand] = useState('');
    const [unitsData, setUnitsData] = useState([]);
    const [des, setDes] = useState('');
    const [brandImage, setBrandImage] = useState(null);
    const [brandImageError, setBrandImageError] = useState(''); 
    const brandImageInputRef = useRef(null);

    // Categories
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subSubCategory, setSubSubCategory] = useState('');

    // City and Zone
    const [city, setCity] = useState('');
    const [zone, setZone] = useState([]);

    // Attributes
    const [attribute, setAttribute] = useState([]);
    const [attributeValue, setAttributeValue] = useState([]);

    // Tax
    const [taxdata, setTaxData] = useState([]);
    const [cgst, setCgst] = useState('');
    const [igst, setIgst] = useState('');
    const [sgst, setSgst] = useState('');
    const [vat, setVat] = useState('');

    const [selectedcgst, setSelectedCgst] = useState('');
    const [selectedigst, setSelectedIgst] = useState('');
    const [selectedsgst, setSelectedSgst] = useState('');
    const [selectedvat, setSelectedVat] = useState('');

    // Image Upload
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState("");
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [thumbnailError, setThumbnailError] = useState('');

    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [attributedata, setAttributeData] = useState('');

    const [colors, setColors] = useState([]);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [brands, setBrands] = useState([]);

    const maxSize = 500 * 1024; // 500KB
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= maxSize) {
            const imageUrl = URL.createObjectURL(file);
            setThumbnailImage(imageUrl);
            setThumbnailError('');
        } else {
            setThumbnailError("Thumbnail image must be less than 500KB.");
        }
    };

    const handlePriceChange = (variantName, price) => {
        setVariantPrices(prev => ({
            ...prev,
            [variantName]: price,
        }));
    };

    const handleHexCodeChange = (variantName, hexCode) => {
        setColorHexCodes(prev => ({
            ...prev,
            [variantName]: hexCode,
        }));
    };

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
        const variantName = e.target.value;
        const selectedAttr = attribute.find(attr => attr._id === attributedata);

        if (variantName && selectedAttr) {
            const isDuplicate = attributeValue.some(
                (item) => item.variantName === variantName && item.attributeName === selectedAttr.Attribute_name
            );
            if (!isDuplicate) {
                const newAttributeValue = [...attributeValue, {
                    attributeName: selectedAttr.Attribute_name,
                    variantName,
                }];
                setAttributeValue(newAttributeValue);
                if (selectedAttr.Attribute_name.toLowerCase() === 'color') {
                    setActiveVariant(variantName);
                }
            }
        }
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        setCategory(selectedId);
        setSubCategory("");
        setSubSubCategory("");

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

    const handleAttribute = async () => {
        if (!addAttribute.trim()) {
            alert("Please enter an attribute name.");
            return;
        }

        try {
            const result = await fetch('https://fivlia.onrender.com/addAtribute', {
                method: 'POST',
                body: JSON.stringify({
                    Attribute_name: addAttribute
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Add Attribute API Response Status:", result.status);
            const responseBody = await result.json();
            console.log("Add Attribute API Response Body:", responseBody);

            if (result.status === 200) {
                alert('Attribute Added Successfully');
                setShowPopup(false);
                setAddattribute('');
                const res = await fetch("https://fivlia.onrender.com/getAttributes");
                const data = await res.json();
                setAttribute(data);
            } else {
                const errorMessage = responseBody.message || `Failed to add attribute (Status: ${result.status})`;
                alert(errorMessage);
            }
        } catch (err) {
            console.error("Error adding attribute:", err);
            alert('Error adding attribute: ' + err.message);
        }
    };

    const handleVarient = async () => {
        if (!attributedata) {
            alert("Please select an attribute first.");
            return;
        }

        if (!addVarient) {
            alert("Please enter a variant name.");
            return;
        }

        try {
            const result = await fetch(`https://node-m8jb.onrender.com/addvarient/${attributedata}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: addVarient
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseBody = await result.json();

            if (result.status === 200) {
                alert('Variant Added Successfully');
                setShowVariantPopup(false);
                setAddVarient('');
                const res = await fetch("https://fivlia.onrender.com/getAttributes");
                const data = await res.json();
                setAttribute(data);
            } else {
                const errorMessage = responseBody.message || `Failed to add variant (Status: ${result.status})`;
                alert(errorMessage);
            }
        } catch (err) {
            console.error("Error adding variant:", err);
            alert('Error adding variant: ' + err.message);
        }
    };

    const handleUnitData = async () => {
        try {
            if (!addUnit) {
                return alert('Please Input Unit Name');
            }
            const result = await fetch('https://fivlia.onrender.com/unit', {
                method: "POST",
                body: JSON.stringify({
                    unitname: addUnit
                }),
                headers: {
                    "Content-type": "application/json"
                }
            });
            if (result.status === 200) {
                alert('Unit Added Successfully');
                setShowUnitPopup(false);

                const res = await fetch('https://fivlia.onrender.com/getUnit');
                const data = await res.json();
                setUnitsData(data.Result);
            } else {
                alert('Something Wrong');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleBrandImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validImageTypes.includes(file.type)) {
                setBrandImageError("Please upload a valid image (JPEG, PNG, JPG)");
                setBrandImage(null);
                return;
            }


            const maxSizeInBytes = 500 * 1024; // 500KB
            if (file.size > maxSizeInBytes) {
                setBrandImageError("Image size must be less than 500KB");
                setBrandImage(null);
                return;
            }

            setBrandImageError(""); 
            setBrandImage(file); 
        }
    };

    const handleBrand = async () => {
        if (!addBrand.trim()) {
            alert("Please enter a brand name.");
            return;
        }

        const formData = new FormData();
        formData.append("brandName", addBrand);
        formData.append("description", des);
        if (brandImage) {
            formData.append("image", brandImage);
        }

        try {
            const result = await fetch('https://fivlia.onrender.com/brand', {
                method: "POST",
                body: formData
            });

            if (result.status === 200) {
                alert('Brand Created Successfully');
                setShowbrandPopup(false);
                setBrand('');
                setDes('');
                setBrandImage(null);
                if (brandImageInputRef.current) {
                    brandImageInputRef.current.value = ""; 
                }
                // Refresh brands
                const res = await fetch("https://fivlia.onrender.com/getBrand");
                const data = await res.json();
                setBrands(data);
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getCategory = async () => {
            try {
                const result = await fetch('https://node-m8jb.onrender.com/getMainCategory');
                if (result.status === 200) {
                    const res = await result.json();
                    setCategories(res.result);
                } else {
                    console.log('Something wrong');
                }
            } catch (err) {
                console.log(err);
            }
        };
        getCategory();

        const getActiveCity = async () => {
            try {
                const result = await fetch('https://fivlia.onrender.com/getAllZone');
                if (result.status === 200) {
                    const res = await result.json();
                    setCityData(res);
                } else {
                    console.log('Something Wrong');
                }
            } catch (err) {
                console.log(err);
            }
        };
        getActiveCity();

        const fetchBrands = async () => {
            try {
                const res = await fetch("https://fivlia.onrender.com/getBrand");
                const data = await res.json();
                setBrands(data);
            } catch (err) {
                console.error("Error fetching brands:", err);
            }
        };

        fetchBrands();

        const getTax = async () => {
            try {
                const res = await fetch("https://node-m8jb.onrender.com/getTax");
                const data = await res.json();
                setTaxData(data.result);
            } catch (err) {
                console.error("Error fetching taxes:", err);
            }
        };
        getTax();

        const fetchAttribute = async () => {
            try {
                const res = await fetch("https://fivlia.onrender.com/getAttributes");
                const data = await res.json();
                setAttribute(data);
            } catch (err) {
                console.error("Error fetching attributes:", err);
            }
        };
        fetchAttribute();

        const getUnits = async () => {
            try {
                const result = await fetch("https://fivlia.onrender.com/getUnit");
                if (result.status === 200) {
                    const res = await result.json();
                    setUnitsData(res.Result);
                } else {
                    console.log('Something wrong');
                }
            } catch (err) {
                console.log(err);
            }
        };
        getUnits();

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
    }, []);

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

    const addColor = () => {
        const hasColorVariant = attributeValue.some(item => item.attributeName.toLowerCase() === 'color');
        if (!hasColorVariant) {
            setColorError("Please select a color variant first.");
            return;
        }

        setColorError("");
        const name = ColorNamer(currentColor).ntc[0].name;
        if (!colors.some(c => c.hex === currentColor)) {
            const newColors = [...colors, { hex: currentColor, name }];
            setColors(newColors);

            if (activeVariant) {
                setColorHexCodes(prev => ({
                    ...prev,
                    [activeVariant]: currentColor,
                }));
            } else {
                const colorVariants = attributeValue.filter(item => item.attributeName.toLowerCase() === 'color');
                if (colorVariants.length > 0) {
                    const latestColorVariant = colorVariants[colorVariants.length - 1];
                    setColorHexCodes(prev => ({
                        ...prev,
                        [latestColorVariant.variantName]: currentColor,
                    }));
                    setActiveVariant(latestColorVariant.variantName);
                }
            }
        }
    };

    const removeColor = (hexToRemove) => {
        setColors(prev => prev.filter(c => c.hex !== hexToRemove));
        setColorHexCodes(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
                if (updated[key] === hexToRemove) {
                    updated[key] = "";
                }
            });
            return updated;
        });
    };

    const handleHexCodeClick = (variantName) => {
        setActiveVariant(variantName);
    };

    const selectedAttribute = attribute.find(attr => attr._id === attributedata);
    const isColorAttribute = selectedAttribute?.Attribute_name?.toLowerCase() === 'color';

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
                        <div className="row-section">
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
                    </div>

                    {/* Image Upload */}
                    <div className="background" id="imagesection">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Images</span>
                        <div className="row-section">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '93%' }}>
                                    <label>Product Thumbnail</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="input-field"
                                        style={{ backgroundColor: 'white' }}
                                        disabled={!!thumbnailImage}
                                    />
                                </div>
                                <div>
                                    {thumbnailError && <p style={{ color: "red", fontSize: '12px' }}>{thumbnailError}</p>}
                                    {thumbnailImage && (
                                        <img
                                            src={thumbnailImage}
                                            alt="Thumbnail"
                                            onClick={() => setThumbnailImage('')}
                                            title="Click to remove"
                                            style={{
                                                width: '180px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #ccc',
                                                cursor: 'pointer',
                                                marginTop: '10px',
                                                marginLeft: '20px'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row-section">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                                <label>Select Units</label>
                                <select className="input-field">
                                    <option value="">--Select Units--</option>
                                    {unitsData.map((item) => (
                                        <option key={item._id} value={item.unitname}>{item.unitname}</option>
                                    ))}
                                </select>

                                <h3
                                    style={{ fontSize: '12px', cursor: 'pointer', color: 'green', marginTop: '10px', marginLeft: '5px' }}
                                    onClick={() => setShowUnitPopup(true)}
                                >
                                    + ADD UNIT
                                </h3>

                                {showUnitPopup && (
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
                                                placeholder="Enter Unit Name"
                                                value={addUnit}
                                                onChange={(e) => setAddUnit(e.target.value)}
                                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <Button onClick={handleUnitData}>Save</Button>
                                                <Button onClick={() => setShowUnitPopup(false)}>Cancel</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="input-container">
                                <label>Select Brand</label>
                                <select className="input-field">
                                    <option value="">--Select Brand--</option>
                                    {brands.map((item) => (
                                        <option key={item._id} value={item._id}>{item.brandName}</option>
                                    ))}
                                </select>

                                <h3
                                    style={{ fontSize: '12px', cursor: 'pointer', color: 'green', marginTop: '10px', marginLeft: '5px' }}
                                    onClick={() => setShowbrandPopup(true)}
                                >
                                    + ADD BRAND
                                </h3>

                                {showbrandPopup && (
                                    <div style={{
                                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        zIndex: 1000,
                                    }}>
                                        <div style={{
                                            background: 'white', padding: 20, borderRadius: 15, minWidth: 300
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Enter Brand Name"
                                                value={addBrand}
                                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                                onChange={(e) => setBrand(e.target.value)}
                                            />

                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                ref={brandImageInputRef}
                                                onChange={handleBrandImage}
                                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                            />
                                            {brandImage && (
                                                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                                                    Selected: {brandImage.name}
                                                </p>
                                            )}
                                            {brandImageError && (
                                                <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
                                                    {brandImageError}
                                                </p>
                                            )}

                                            <textarea
                                                placeholder="Enter Brand Description"
                                                value={des}
                                                onChange={(e) => setDes(e.target.value)}
                                                style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '10px' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <Button onClick={handleBrand}>Save</Button>
                                                <Button onClick={() => {
                                                    setShowbrandPopup(false);
                                                    setBrand('');
                                                    setDes('');
                                                    setBrandImage(null);
                                                    if (brandImageInputRef.current) {
                                                        brandImageInputRef.current.value = "";
                                                    }
                                                }}>Cancel</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row-section">
                            <div className="input-container">
                                <label>Select Attribute</label>
                                <select className="input-field" value={attributedata} onChange={(e) => setAttributeData(e.target.value)}>
                                    <option value="">--Select Attribute--</option>
                                    {attribute.map((item) => (
                                        <option key={item._id} value={item._id}>{item.Attribute_name}</option>
                                    ))}
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
                                                <Button onClick={handleAttribute}>Save</Button>
                                                <Button onClick={() => setShowPopup(false)}>Cancel</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="input-container">
                                <label>Select Variant</label>
                                <select className="input-field" onChange={handleAttributeValueChange}>
                                    <option value="">--Select Attribute Value--</option>
                                    {attribute
                                        .find((attr) => attr._id === attributedata)?.varient
                                        ?.map((variant, index) => (
                                            <option key={index} value={variant.name}>
                                                {variant.name}
                                            </option>
                                        ))}
                                </select>
                                <h3
                                    style={{ fontSize: '12px', cursor: 'pointer', color: 'green', marginTop: '10px', marginLeft: '5px' }}
                                    onClick={() => setShowVariantPopup(true)}
                                >
                                    + ADD VARIANT
                                </h3>

                                {showVariantPopup && (
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
                                                placeholder="Enter variant value"
                                                value={addVarient}
                                                onChange={(e) => setAddVarient(e.target.value)}
                                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <Button onClick={handleVarient}>Save</Button>
                                                <Button onClick={() => setShowVariantPopup(false)}>Cancel</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row-section" style={{ flexWrap: 'wrap' }}>
                            {attributeValue.map((item, index) => (
                                <div key={index} className="input-container" style={{ flex: '1 0 30%', marginBottom: '20px' }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <label style={{ fontSize: '15px' }}>
                                            {item.attributeName} - {item.variantName}
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter Price"
                                        className="input-field"
                                        value={variantPrices[item.variantName] || ""}
                                        style={{ backgroundColor: 'white', marginBottom: '10px' }}
                                        onChange={(e) => handlePriceChange(item.variantName, e.target.value)}
                                    />
                                    {item.attributeName.toLowerCase() === 'color' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Hex Code"
                                                className="input-field"
                                                value={colorHexCodes[item.variantName] || ""}
                                                style={{ backgroundColor: 'white' }}
                                                onClick={() => handleHexCodeClick(item.variantName)}
                                                onChange={(e) => handleHexCodeChange(item.variantName, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {isColorAttribute && (
                            <div className="input-container" style={{ width: "100%", padding: '20px' }}>
                                <label>Select Colors (Global)</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                    <input
                                        type="color"
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                    <button
                                        onClick={addColor}
                                        style={{
                                            padding: "8px 16px",
                                            background: "#1976d2",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: "5px"
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                {colorError && <p style={{ color: "red", fontSize: '12px', marginBottom: '10px' }}>{colorError}</p>}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {colors.map((color, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                minWidth: "100px",
                                                position: "relative"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    backgroundColor: color.hex,
                                                    borderRadius: "50%",
                                                    marginBottom: "5px",
                                                    border: "1px solid #aaa",
                                                }}
                                            />
                                            <div style={{ fontSize: "12px" }}>
                                                <strong>{color.name}</strong>
                                                <br />
                                                {color.hex}
                                            </div>
                                            <button
                                                onClick={() => removeColor(color.hex)}
                                                style={{
                                                    position: "absolute",
                                                    top: "-6px",
                                                    right: "-6px",
                                                    background: "red",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tax Section */}
                    <div className="background" id="taxsection">
                        <span style={{ marginLeft: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Product Taxes</span>
                        <div className="row-section">
                            <div className="input-container">
                                <label>CGST</label>
                                <select className="input-field" value={cgst} onChange={(e) => setCgst(e.target.value)}>
                                    <option value="">--Select Tax Percentage--</option>
                                    {taxdata.map((item) => (
                                        <option key={item._id} value={item.value}>{item.value}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-container">
                                <label>IGST</label>
                                <select className="input-field" value={igst} onChange={(e) => setIgst(e.target.value)}>
                                    <option value="">--Select Tax Percentage--</option>
                                    {taxdata.map((item) => (
                                        <option key={item._id} value={item.value}>{item.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row-section">
                            <div className="input-container">
                                <label>SGST</label>
                                <select className="input-field" value={sgst} onChange={(e) => setSgst(e.target.value)}>
                                    <option value="">--Select Tax Percentage--</option>
                                    {taxdata.map((item) => (
                                        <option key={item._id} value={item.value}>{item.value}</option>
                                    ))}
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
                            onClick={() => navigate(-1)}
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
                        { id: 'citysection', label: 'City & Attribute' },
                        { id: 'taxsection', label: 'Tax Information' },
                    ].map((item, index, array) => (
                        <div key={item.id} style={{ position: 'relative' }}>
                            {index < array.length - 1 && (
                                <div
                                    className={`dashed-line ${activeSection === item.id || array[index + 1].id === activeSection ? 'active' : ''}`}
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
        </MDBox>
    );
}

export default Product;