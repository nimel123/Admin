import React from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";

function AddBrand() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');


    const ImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };


    const handleBrands = async () => {
        try {
            const formData = new FormData();
            formData.append("brandName", name);
            formData.append("description", description);
            formData.append("image", document.querySelector('input[type="file"]').files[0]);

            const result = await fetch('https://fivlia.onrender.com/brand', {
                method: "POST",
                body: formData,
            });

            if (result.status === 200) {
                alert('Brand Created Successfully');
                navigate(-1)
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "20px" }}>
            <div style={{
                width: "85%",
                margin: "0 auto",
                borderRadius: "10px",
                padding: "10px",
                border: '1px solid gray',
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            }}>

                <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 'bold', color: 'green' }}>ADD NEW BRAND</h2>

                {/* Brand Name */}
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                    <div><label style={{ fontWeight: '500' }}>Brand Name</label></div>
                    <div style={{ width: "58%" }}>
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter Brand Name"
                            onChange={(e) => setName(e.target.value)}
                            style={{ border: '1px solid black', backgroundColor: 'white' }}
                        />
                    </div>
                </div>


                {/* Image */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginBottom: "25px"
                }}>
                    <label style={{ fontWeight: "500" }}>Brand Image</label>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "58%"
                    }}>
                        <input
                            type="file"
                            onChange={ImagePreview}
                            style={{
                                width: "100%",
                                height: '45px',
                                borderRadius: '10px',
                                marginRight: "20px",
                                border: '0.5px solid black',
                                backgroundColor: 'white'
                            }}
                        />
                        {image && (
                            <img
                                src={image}
                                alt="preview"
                                style={{
                                    width: "130px",
                                    height: "130px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Description */}
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                    <div><label style={{ fontWeight: '500' }}>Description</label></div>
                    <div style={{ width: "59%", marginLeft: "45px" }}>
                        <textarea
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: "100%", height: "100px", borderRadius: '10px', padding: '5px' }}
                        />
                    </div>
                </div>



                {/* Submit Button */}
                <div style={{ textAlign: "center", }}>
                    <Button style={{
                        width: '80px', height: '40px', fontSize: "16px", marginTop: '10px',
                        marginBottom: '20px', backgroundColor: '#00c853', color: 'white', borderRadius: '15px', marginRight: '50px', cursor: 'pointer'
                    }}
                        onClick={handleBrands}
                    >
                        SAVE
                    </Button>
                    <Button onClick={() => navigate(-1)} style={{
                        width: '80px', height: '40px', fontSize: "16px", marginTop: '10px',
                        marginBottom: '20px', backgroundColor: '#00c853', color: 'white', borderRadius: '15px', cursor: 'pointer'
                    }}
                    >
                        BACK
                    </Button>
                </div>
            </div>
        </MDBox>
    )
}

export default AddBrand;