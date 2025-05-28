import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import './AddStore.css';
import { Button, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddStore() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const [selectedServices, setSelectedServices] = useState([]);
    const navigate = useNavigate()

    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleSwitchChange = (event) => {
        setIsAuthorized(event.target.checked);
    };

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
                            <label>Owner Name</label>
                            <input type="text" placeholder="Enter Vender Name" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Owner Mobile</label>
                            <input type="text" placeholder="Owner Mobile Number" />
                        </div>
                        <div className="store-input">
                            <label>Store Phone Number</label>
                            <input type="text" placeholder="Store Phone Number" />
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

            <div className="store-container">
                <div className="store-header">Category Selection</div>

                <div className="store-form" style={{ marginBottom: '30px' }}>
                    <div className="store-row">

                        <div className="store-input">
                            <label>Authorized Store</label>
                            <Switch
                                checked={isAuthorized}
                                onChange={handleSwitchChange}
                                color="success"
                                inputProps={{ "aria-label": "Authorized Store Toggle" }}
                            />
                            {/* Optional: Show status */}
                            <p>Status: {isAuthorized ? "Authorized Store" : "Not Authorized"}</p>
                        </div>


                        {isAuthorized && (
                            <div className="store-input">
                                <label>Select Category</label>
                                <select >
                                    <option value="">---Select Category---</option>
                                    <option value="cat1">Category 1</option>
                                    <option value="cat2">Category 2</option>
                                </select>
                            </div>
                        )}
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

        </MDBox>
    );
}

export default AddStore;