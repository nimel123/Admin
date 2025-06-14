import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

import { Button, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

const deliveryStatuses = [
    "Pending",
    "Confirmed",
    "Packed",
    "Dispatched",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
    "Delivery Failed",
];

function Setting() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const [selectedServices, setSelectedServices] = useState([]);
    const navigate = useNavigate()
    const [selectedStaus,setSelectedStatus]=useState('')

    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleSwitchChange = (event) => {
        setIsAuthorized(event.target.checked);
    };


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
                <div className="store-header">Personal Details</div>
                <div className="store-form">
                    <div className="store-row">
                        <div className="store-input">
                            <label>Owner Name</label>
                            <input type="text" placeholder="Enter Owner Name" />
                        </div>
                        <div className="store-input">
                            <label>Owner Email</label>
                            <input type="email" placeholder="Enter Owner Email" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Mobile Number</label>
                            <input type="pas" placeholder="Owner Mobile Number" />
                        </div>
                        <div className="store-input">
                            <label>Phone Number</label>
                            <input type="text" placeholder="Store Phone Number" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Password</label>
                            <input type="password" placeholder="Enter Password" />
                        </div>
                        <div className="store-input">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Enter Password Again" />
                        </div>
                    </div>

                    <div className="store-row">
                        <div className="store-input">
                            <label>Platform Fee</label>
                            <input type="text" placeholder="Enter Platform Fee" />
                        </div>
                        <div className="store-input">
                            <label>GST Certificate Number</label>
                            <input type="text" placeholder="Enter Gst Number" />
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

            {/* Delivery Charges Section */}
            <div className="store-container">
                <div className="store-header">Delivery Charges</div>
                <div className="store-form">
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Delivery Charge</label>
                        <input type="number" placeholder="5" />
                    </div>

                </div>
            </div>

            <div className="store-container">
                <div className="store-header">Delivery Status</div>
                <div className="store-form">
                    <div className="store-input" style={{ flex: "1 1 100%" }}>
                        <label>Set Delivery Status </label>
                        <select
                            id="deliveryStatus"
                            value={selectedStaus}
                            onChange={(e)=>setSelectedStatus(e.target.value)}
                            style={{ padding: "8px", width: "100%", marginTop: "10px" }}
                        >
                            <option value="">-- Select Status --</option>
                            {deliveryStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
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

        </MDBox>
    );
}

export default Setting;