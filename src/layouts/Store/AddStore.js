import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import './AddStore.css';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddStore() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const [selectedServices, setSelectedServices] = useState([]);
    const navigate=useNavigate()

    const services = [
        "Publish",
        "Cash on Delivey",
        "Free Wi-Fi",
        "Good for Breakfast",
        "Good for Dinner",
        "Good for Lunch",
        "Live Music",
        "Outdoor Seating",
        "Takes Reservations",
        "Vegetarian Friendly",
    ];

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedServices([...selectedServices, value]);
        } else {
            setSelectedServices(selectedServices.filter((service) => service !== value));
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
            {/* Store Details */}
            <div className="store-container">
                <div className="store-header">Store Details</div>
                <div className="store-form">
                    <div className="store-row">
                        <div className="store-input">
                            <label>Store Name</label>
                            <input type="text" placeholder="Enter Store Name" />
                        </div>
                        <div className="store-input">
                            <label>Vender Name</label>
                            <input type="text" placeholder="Enter Vender Name" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Select Category</label>
                            <select>
                                <option value="">---Select Category---</option>
                            </select>
                        </div>
                        <div className="store-input">
                            <label>Phone Number</label>
                            <input type="text" placeholder="Enter Phone Number" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Select City</label>
                            <select>
                                <option value="">---Select City---</option>
                            </select>
                        </div>
                        <div className="store-input">
                            <label>Select Zone</label>
                            <select>
                                <option value="">---Select Zone---</option>
                            </select>
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Latitude</label>
                            <input type="text" placeholder="Enter Latitude" />
                        </div>
                        <div className="store-input">
                            <label>Longitude</label>
                            <input type="text" placeholder="Enter Longitude" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input" style={{ flex: "1 1 100%" }}>
                            <label>Description</label>
                            <textarea
                                placeholder="Type your text here..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Galary Section */}
            <div className="store-container">
                <div className="store-header">Gallery</div>
                <div className="store-form">
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Choose Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {selectedImage && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    style={{
                                        marginTop: "10px",
                                        width: "80%",
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc",

                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Section */}
            <div className="store-container">
                <div className="store-header">Services</div>
                <div className="store-form">
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Select Services</label>
                        <div className="checkbox-list">
                            {services.map((service, index) => (
                                <label key={index} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        value={service}
                                        onChange={handleCheckboxChange}
                                    />
                                    {service}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Charges Section */}
            <div className="store-container">
                <div className="store-header">Delivery Charges</div>
                <div className="store-form">
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Delivery Charge Per Km</label>
                        <input type="number" placeholder="5" disabled />
                    </div>
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Minimum Delivery Charges</label>
                        <input type="number" placeholder="20" disabled />
                    </div>
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Minimum Delivery Charge Within Km</label>
                        <input type="number" placeholder="5" disabled />
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
                                        onClick={()=>navigate(-1)}
                                    >
                                        BACK
                                    </Button>
                                </div>

        </MDBox>
    );
}

export default AddStore;