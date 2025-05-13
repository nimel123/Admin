import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Typography,
    Switch,
    Box,
    useMediaQuery,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function GetSubCategories() {
    const location = useLocation();
    const category = location.state;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const parsedZones = JSON.parse(category?.zones || "[]");
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedZone, setSelectedZone] = useState("All");
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const updated = category?.subcat?.map((sub) => ({
            ...sub,
            store: parsedZones[0] || "NA",
            category: category.name,
            isPublished: true,
        })) || [];
        setData(updated);
    }, [category]);

    const handleToggle = (id) => {
        const updatedData = data.map((item, index) =>
            index === id ? { ...item, isPublished: !item.isPublished } : item
        );
        setData(updatedData);
    };

    const filtered = data
        .filter((item) => selectedZone === "All" || item.store === selectedZone)
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalPages = Math.ceil(filtered.length / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const filteredData = filtered.slice(startIndex, startIndex + entriesToShow);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedZone, entriesToShow]);

    return (
        <Box sx={{ ml: { xs: "0", md: "250px" }, p: 2, marginTop: "50px" }}>
            <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                <Typography variant="h4" gutterBottom>
                    Sub Categories
                </Typography>

                {/* Filter Bar */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Show Dropdown - Left */}
                    <FormControl sx={{ minWidth: 70, marginLeft: 5 }}>
                        <InputLabel>Show</InputLabel>
                        <Select
                            value={entriesToShow}
                            label="Show"
                            onChange={(e) => setEntriesToShow(Number(e.target.value))}
                            style={{ height: 44.5 }}
                        >
                            {[5, 10, 15].map((num) => (
                                <MenuItem key={num} value={num}>{num}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Zone and Search - Right */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                        }}
                    >
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Zone</InputLabel>
                            <Select
                                value={selectedZone}
                                label="Zone"
                                onChange={(e) => setSelectedZone(e.target.value)}
                                style={{ height: 44.5 }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                {parsedZones.map((zone) => (
                                    <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 200 }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        background: '#1A73E8',
                        color: 'white !important',
                        padding: '20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        width: '90%', // slightly smaller than table
                        maxWidth: '950px',
                        position: 'relative',
                        zIndex: 2,
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto', // center horizontally
                        mt: 2,
                    }}
                >
                    SubCategories Lists
                </Box>

                <Box sx={{
                    border: "1px solid #1976d2",
                    borderRadius: "8px",
                    overflow: "hidden",
                    mt: "-25px",
                    position: "relative",
                }}>
                    {/* Table Header */}
                    {!isMobile && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "40% 10% 15% 20% 15%",
                                backgroundColor: "#e3f2fd",
                                fontWeight: "bold",
                                borderTop: "1px solid #1976d2",
                                borderBottom: "1px solid #1976d2",
                                fontSize: 17,
                                height: 70,
                                alignItems: 'flex-end',

                                zIndex: 0,

                            }}
                        >
                            <Box sx={{ p: 1, borderRight: "1px solid #1976d2" }}>Name</Box>
                            <Box sx={{ p: 1, borderRight: "1px solid #1976d2" }}>Price</Box>
                            <Box sx={{ p: 1, borderRight: "1px solid #1976d2" }}>Store</Box>
                            <Box sx={{ p: 1, borderRight: "1px solid #1976d2" }}>Category</Box>
                            <Box sx={{ p: 1 }}>Published</Box>
                        </Box>
                    )}

                    {/* Table Rows */}
                    {filteredData.map((sub, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "40% 10% 15% 20% 15%",
                                fontSize: 15,
                                borderBottom: "1px solid #ccc",
                                backgroundColor: "#fff",
                            }}
                        >
                            {isMobile ? (
                                <>
                                    <Box sx={{ p: 1 }}><strong>Name:</strong> {sub.name}</Box>
                                    <Box sx={{ p: 1 }}><strong>Price:</strong> ₹{sub.price}</Box>
                                    <Box sx={{ p: 1 }}><strong>Store:</strong> {sub.store}</Box>
                                    <Box sx={{ p: 1 }}><strong>Category:</strong> {sub.category}</Box>
                                    <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
                                        <strong>Published:</strong>
                                        <Switch
                                            checked={sub.isPublished}
                                            onChange={() => handleToggle(index)}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ p: 1, borderRight: "1px solid #ccc" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <img
                                                src={`https://node-m8jb.onrender.com${sub.file}`}
                                                alt={sub.name}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    marginRight: 10,
                                                    borderRadius: 4,
                                                }}
                                            />
                                            <span>{sub.name}</span>
                                        </Box>
                                    </Box>
                                    <Box sx={{ p: 1, display: "flex", alignItems: "center", borderRight: "1px solid #ccc" }}>₹{sub.price}</Box>
                                    <Box sx={{ p: 1, display: "flex", alignItems: "center", borderRight: "1px solid #ccc" }}>{sub.store}</Box>
                                    <Box sx={{ p: 1, display: "flex", alignItems: "center", borderRight: "1px solid #ccc" }}>{sub.category}</Box>
                                    <Box sx={{ p: 1 }}>
                                        <Switch
                                            checked={sub.isPublished}
                                            onChange={() => handleToggle(index)}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ padding: "6px 12px", backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "4px" }}
                        >
                            Previous
                        </button>
                        <Typography variant="body1">Page {currentPage} of {totalPages}</Typography>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ padding: "6px 12px", backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "4px" }}
                        >
                            Next
                        </button>
                    </Box>
                )}
            </div>
        </Box>
    );
}

export default GetSubCategories;
