import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import './Categories.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch'; 
import { useNavigate } from "react-router-dom";

function Categories() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const [categories, setCategories] = useState([]);
      const navigate = useNavigate();

    useEffect(() => {
        const getCategories = async () => {
            const result = await fetch('http://localhost:5000/Getcategories');
            if (result.status === 200) {
                const json = await result.json();
                setCategories(json.result);
            }
        };
        getCategories();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
        if (!confirmDelete) return;

        try {
            const result = await fetch(`http://localhost:5000/delete/${id}`, {
                method: "DELETE",
            });

            if (result.status === 200) {
                alert("Categories deleted successfully");
                setCategories(categories.filter((item) => item._id !== id));
            } else {
                alert("Something went wrong");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handlePublishToggle = async (id, currentValue) => {
        try {
            const result = await fetch(`http://localhost:5000/togglepublish/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publish: !currentValue }),
            });

            if (result.status === 200) {
                setCategories((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, publish: !currentValue } : item
                    )
                );
            } else {
                alert("Failed to update publish status");
            }
        } catch (err) {
            console.error("Toggle publish error:", err);
        }
    };

    const AddCate=()=>{
        navigate('/addCategories')
    }

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
            <div className="tabel-container">
                <div className="table-header">
                    <div>
                        <h2 className="table-title">Category List</h2>
                        <h3 style={{ fontFamily: 'Urbanist', fontSize: '16px' }}>
                            View and manage all categories
                        </h3>
                    </div>
                    <button className="add-button" onClick={AddCate}>+ Add Categories</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr className="table-head">
                            <td className="table-name">Name</td>
                            <td className="table-items">Items</td>
                            <td className="table-publish">Publish</td>
                            <td className="table-action">Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item._id} className="table-row">
                                <td className="table-cell">
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                        <img
                                            src={`http://localhost:5000${item.file}`}
                                            alt="category"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                        <span style={{ marginTop: 6 }}>{item.name}</span>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <img
                                        src={`http://localhost:5000${item.file}`}
                                        alt="category"
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td className="table-cell">
                                    <Switch
                                        checked={item.publish}
                                        onChange={() => handlePublishToggle(item._id, item.publish)}
                                        color="primary"
                                    />
                                </td>
                                <td className="table-cell">
                                    <button className="edit-btn">
                                        <EditIcon style={{ fontSize: "24px" }} />
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MDBox>
    );
}

export default Categories;
