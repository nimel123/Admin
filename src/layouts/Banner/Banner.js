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

function BannerManagement() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch banners from API
    useEffect(() => {
        const getBanner = async () => {
            try {
                const response = await fetch("https://fivlia.onrender.com/getAllBanner");
                const bannersArray = await response.json();

                if (Array.isArray(bannersArray)) {
                    const bannerWithStatus = bannersArray.map(banner => ({
                        _id: banner._id,
                        bannerId: banner.bannerId,
                        bannerImage: banner.image,
                        bannerName: banner.title,
                        type: banner.type,
                        city: banner.zone?.length ? banner.zone[0] : "N/A",
                        // Assume backend status is boolean true/false
                        status: banner.status, 
                        public: banner.status === true, // boolean for switch
                    }));
                    setBanners(bannerWithStatus);
                } else {
                    console.error("Expected an array but got:", bannersArray);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        getBanner();
    }, []);

    // Toggle status (boolean) and update backend
    const togglePublic = async (banner) => {
        const newStatus = !banner.public; // toggle boolean

        try {
            const res = await fetch(`https://fivlia.onrender.com/admin/banner/${banner._id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }), // send boolean status
            });

            const data = await res.json();
            if (res.ok) {
                setBanners(prev =>
                    prev.map(b =>
                        b._id === banner._id
                            ? { ...b, status: newStatus, public: newStatus }
                            : b
                    )
                );
            } else {
                console.error("Error updating banner:", data.message);
            }
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    const filteredBanners = banners.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
            item.bannerName.toLowerCase().includes(search) ||
            item.type.toLowerCase().includes(search) ||
            item.city.toLowerCase().includes(search)
        );
    });

    const totalPages = Math.ceil(filteredBanners.length / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const currentBanners = filteredBanners.slice(startIndex, startIndex + entriesToShow);

    const handleEntriesChange = (e) => {
        setEntriesToShow(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleDeleteBanner = async (bannerId) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            setBanners((prev) => prev.filter((banner) => banner.bannerId !== bannerId));
            // TODO: Make API call to delete banner on backend
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
            <div className="banner-container">
                <div
                    className="add-banner-box"
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

                        {/* Search input */}
                        <div
                            style={{
                                marginBottom: 8,
                                marginTop: "15px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <label
                                style={{
                                    fontSize: 16,
                                    marginTop: "-8px",
                                    marginLeft: "5px",
                                    marginBottom: "5px",
                                }}
                            >
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by banner name, type or city..."
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
                                    <th style={{ ...headerCell, width: "15%" }}>Type</th>
                                    <th style={headerCell}>City</th>
                                    <th style={headerCell}>Public</th>
                                    <th style={{ ...headerCell, width: "20%", textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBanners.map((item, index) => (
                                    <tr key={item._id}>
                                        <td style={{ ...bodyCell, width: '7%' }}>{startIndex + index + 1}</td>
                                        <td style={{ ...bodyCell, paddingLeft: "20px", }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "15px",
                                                    paddingLeft: "20px",
                                                }}
                                            >
                                                <img
                                                    src={item.bannerImage}
                                                    alt={item.bannerName}
                                                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
                                                />
                                                <span style={{ fontSize: 16 }}>{item.bannerName}</span>
                                            </div>
                                        </td>

                                        <td style={{ ...bodyCell, width: '3%' }}>{item.type}</td>
                                        <td style={{ ...bodyCell, width: '10%' }}>{item.city}</td>
                                        <td style={bodyCell}>
                                            <Switch
                                                checked={item.public}
                                                onChange={() => togglePublic(item)}
                                                color="primary"
                                                inputProps={{ "aria-label": "public toggle" }}
                                            />
                                        </td>
                                        <td style={{ ...bodyCell, textAlign: "center", padding: "14px" }}>
                                            <button
                                                style={{
                                                    backgroundColor: "#007BFF",
                                                    color: "white",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    marginRight: "10px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {currentBanners.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ ...bodyCell, textAlign: "center" }}>
                                            No banners found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        style={{
                            marginTop: 15,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}
                    >
                        <div style={{ marginTop: 10 }}>
                            Showing {startIndex + 1} to{" "}
                            {startIndex + currentBanners.length} of {filteredBanners.length} entries
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 10,
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                style={{
                                    minWidth: "40px",
                                    fontWeight: "bold",
                                    borderRadius: "5px",
                                    fontSize: 15,
                                }}
                            >
                                {"<"}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                style={{
                                    minWidth: "40px",
                                    fontWeight: "bold",
                                    borderRadius: "5px",
                                    fontSize: 15,
                                }}
                            >
                                {">"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </MDBox>
    );
}

export default BannerManagement;
