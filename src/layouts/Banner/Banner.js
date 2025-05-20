import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { Button, Switch } from "@mui/material";

const headerCell = {
    padding: "14px 12px",
    border: "1px solid #ddd",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "white",
};

const bodyCell = {
    padding: "12px",
    border: "1px solid #eee",
    fontSize: 17,
    backgroundColor: "#fff",
    verticalAlign: "middle",
};

function BanerManagement() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    // Dummy data with bannerName as {image + name}, type and public toggle state
    const [locations, setLocations] = useState([
        {
            _id: "1",
            bannerName: "Summer Sale",
            bannerImage: "https://via.placeholder.com/50x30?text=Summer", // dummy image
            type: "main",
            public: true,
            city: "New York",
            address: "123 Main St, New York",
            range: 1500,
        },
        {
            _id: "2",
            bannerName: "Winter Specials",
            bannerImage: "https://via.placeholder.com/50x30?text=Winter",
            type: "sub-categories",
            public: false,
            city: "Los Angeles",
            address: "456 Sunset Blvd, Los Angeles",
            range: 800,
        },
        {
            _id: "3",
            bannerName: "Flash Deals",
            bannerImage: "https://via.placeholder.com/50x30?text=Flash",
            type: "main",
            public: true,
            city: "Chicago",
            address: "789 Lake Shore Dr, Chicago",
            range: 500,
        },
        {
            _id: "4",
            bannerName: "Festive Offers",
            bannerImage: "https://via.placeholder.com/50x30?text=Festive",
            type: "sub-categories",
            public: false,
            city: "New York",
            address: "101 Broadway, New York",
            range: 2000,
        },
    ]);

    const [entriesToShow, setEntriesToShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("All Cities");

    // Toggle public status for a banner
    const togglePublic = (id) => {
        setLocations((prev) =>
            prev.map((loc) =>
                loc._id === id ? { ...loc, public: !loc.public } : loc
            )
        );
    };

    // Get distinct cities for dropdown
    const distinctCities = ["All Cities", ...new Set(locations.map((loc) => loc.city))];

    // Filter locations by search term AND selected city
    const filteredLocations = locations.filter((item) => {
        const search = searchTerm.toLowerCase();
        const formattedRange =
            item.range >= 1000 ? (item.range / 1000).toFixed(1) + " km" : item.range + " m";

        const cityMatch = selectedCity === "All Cities" || item.city === selectedCity;
        const searchMatch =
            item.bannerName.toLowerCase().includes(search) ||
            item.city.toLowerCase().includes(search) ||
            item.type.toLowerCase().includes(search);

        return cityMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredLocations.length / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const currentLocations = filteredLocations.slice(startIndex, startIndex + entriesToShow);

    const handleEntriesChange = (e) => {
        setEntriesToShow(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setCurrentPage(1);
    };

    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handledeleteZone = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            setLocations((prev) => prev.filter((loc) => loc._id !== id));
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
            <div className="city-container">
                <div
                    className="add-city-box"
                    style={{
                        width: "100%",
                        borderRadius: 15,
                        padding: 20,
                        overflowX: "auto",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <span style={{ fontWeight: "bold", fontSize: 26 }}>Banner Lists</span>
                            <br />
                            <span style={{ fontSize: 17 }}>View and manage all Banners</span>
                        </div>
                        <div>
                            <Button
                                style={{
                                    backgroundColor: "#00c853",
                                    height: 45,
                                    width: 150,
                                    fontSize: 12,
                                    color: "white",
                                    letterSpacing: "1px",
                                }}
                                onClick={() => navigate("/add-banner")}
                            >
                                + ADD BANNER
                            </Button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Entries dropdown */}
                        <div style={{ marginBottom: 10 }}>
                            <span style={{ fontSize: 16 }}>Show Entries</span>&nbsp;
                            <select value={entriesToShow} onChange={handleEntriesChange}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            {/* Left side dropdown for city */}
                            <div style={{ marginBottom: 10, marginRight: "40px" }}>
                                <label style={{ fontSize: 16 }}>Filter by City:</label>
                                <select
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    style={{ fontSize: 16, borderRadius: "6px" }}
                                >
                                    {distinctCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search input */}
                            <div
                                style={{
                                    marginBottom: 8,
                                    marginTop: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <label style={{ fontSize: 16, marginTop: "-8px", marginLeft: "5px", marginBottom: "5px" }}>
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search..."
                                    style={{
                                        padding: "5px",
                                        borderRadius: "20px",
                                        height: "45px",
                                        marginTop: "-5px",
                                        width: "200px",
                                        border: "1px solid #ccc",
                                        fontSize: 17,
                                        paddingLeft: "15px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "separate",
                                borderSpacing: 0,
                                overflow: "hidden",
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={headerCell}>Sr. No</th>
                                    <th style={headerCell}>Banner Name</th>
                                    <th style={{ ...headerCell, width: '15%' }}>Type</th>
                                    <th style={headerCell}>Public</th>
                                    <th style={{ ...headerCell, width: "20%", textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLocations.map((item, index) => (
                                    <tr key={item._id}>
                                        <td style={bodyCell}>{startIndex + index + 1}</td>
                                        <td style={{ ...bodyCell, paddingLeft: "20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "15px",paddingLeft:'20px' }}>
                                                <img
                                                    src={item.bannerImage}
                                                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
                                                   
                                                />
                                                <span style={{ fontSize: 16 }}>{item.bannerName}</span>
                                            </div>
                                        </td>

                                        <td style={bodyCell}>{item.type}</td>
                                        <td style={bodyCell}>
                                            <Switch
                                                checked={item.public}
                                                onChange={() => togglePublic(item._id)}
                                                color="primary"
                                                inputProps={{ "aria-label": "public toggle" }}
                                            />
                                        </td>
                                        <td style={bodyCell}>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <button
                                                    style={{
                                                        backgroundColor: "#007BFF",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 16px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        marginRight: "10px",
                                                    }}
                                                    onClick={() => alert(`Edit banner ${item.bannerName} (id: ${item._id})`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: "#dc3545",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 16px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handledeleteZone(item._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {currentLocations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                                            No banners found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        style={{
                            marginTop: 20,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span>
                            Showing {filteredLocations.length === 0 ? 0 : startIndex + 1}-
                            {Math.min(startIndex + entriesToShow, filteredLocations.length)} of{" "}
                            {filteredLocations.length} locations
                        </span>
                        <div>
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                style={{
                                    padding: "8px 16px",
                                    marginRight: 10,
                                    borderRadius: 10,
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 10,
                                    cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MDBox>
    );
}

export default BanerManagement;
