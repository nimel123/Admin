import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function CityTable() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [cities, setCities] = useState([]);
    const [entriesToShow, setEntriesToShow] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // When we get API data, add default active status (true) to each city object, and add id for keys (use _id)
    useEffect(() => {
        const getCity = async () => {
            try {
                const result = await fetch("https://node-m8jb.onrender.com/getcitydata");
                const data = await result.json();
                // Add active property and id (from _id)
                const citiesWithStatus = data.result.map((city) => ({
                    id: city._id,
                    name: city.city,
                    state: city.state,
                    active: true, // default active status
                }));
                setCities(citiesWithStatus);
            } catch (err) {
                console.log(err);
            }
        };
        getCity();
    }, []);

    // Filter by city name
    const filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCities.length / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const endIndex = startIndex + entriesToShow;
    const currentCities = filteredCities.slice(startIndex, endIndex);

    // Handlers
    const handleEntriesChange = (e) => {
        setEntriesToShow(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Toggle status (Active/Deactive)
    const toggleStatus = (id) => {
        setCities((prev) =>
            prev.map((city) =>
                city.id === id ? { ...city, active: !city.active } : city
            )
        );
    };

    // Edit city
    const handleEdit = (city) => {
        alert(`Edit city: ${city.name}`);
    };

    // Delete city
    const handleDelete = async (id) => {
        try {
            const result = await fetch(`https://node-m8jb.onrender.com/deleteCity/${id}`, {
                method: 'DELETE'
            });
            if (result.status === 200) {
                if (window.confirm(`Are you sure you want to delete `)) {
                    setCities((prev) => prev.filter((loc) => loc.id !== id));
                    alert('Success')
                }
            }
            else {
                return;
            }
        }
        catch (err) {
            console.log(err);

        }
    }

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "30px" }}>
            <div
                style={{
                    width: "100%",
                    paddingRight: "20px",
                    paddingLeft: "20px",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
                            City Lists
                        </h2>
                        <p style={{ margin: 0, fontSize: "18px", color: "#555" }}>
                            View and manage all cities
                        </p>
                    </div>
                    <Button
                        style={{
                            backgroundColor: "#00c853",
                            height: 45,
                            width: 150,
                            fontSize: 15,
                            color: "white",
                            letterSpacing: "1px",
                        }}
                        onClick={() => navigate("/city")}
                    >
                        + Add City
                    </Button>
                </div>

                {/* Controls */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 15,
                    }}
                >
                    <div>
                        <label style={{ fontSize: 17 }}>Show Entries&nbsp;</label>
                        <select
                            value={entriesToShow}
                            onChange={handleEntriesChange}
                            style={{
                                fontSize: 16,
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        >
                            {[5, 10, 20, 30].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 17, marginRight: 8 }}>Search:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search cities..."
                            style={{
                                padding: "8px 14px",
                                borderRadius: "25px",
                                height: "42px",
                                width: "220px",
                                border: "1px solid #ccc",
                                fontSize: 16,
                                outline: "none",
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div
                    style={{
                        borderRadius: "10px",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: '"Urbanist", sans-serif',
                            fontSize: "17px",
                            border: "1px solid #007BFF",
                            overflow: "hidden",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "center",
                                        width: '10%'
                                    }}
                                >
                                    Sr No
                                </th>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "left",

                                    }}
                                >
                                    City
                                </th>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "left",
                                        width: "30%",
                                    }}
                                >
                                    State
                                </th>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "center",
                                        width: "15%",
                                    }}
                                >
                                    Status
                                </th>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "center",
                                        width: "20%",
                                    }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCities.length > 0 ? (
                                currentCities.map((city, index) => (
                                    <tr key={city.id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {startIndex + index + 1}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                            }}
                                        >
                                            {city.name}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                            }}
                                        >
                                            {city.state}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                                verticalAlign: "middle",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                color: city.active ? "green" : "red",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => toggleStatus(city.id)} // Toggle status on click
                                        >
                                            {city.active ? "Active" : "Deactive"}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                                verticalAlign: "middle",
                                                textAlign: "center",
                                            }}
                                        >
                                            <button
                                                onClick={() => handleEdit(city)}
                                                style={{
                                                    backgroundColor: "#007BFF",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(city.id)}
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                        No cities found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "16px",
                    }}
                >
                    <div>
                        Showing {startIndex + 1} to{" "}
                        {endIndex > filteredCities.length ? filteredCities.length : endIndex} of{" "}
                        {filteredCities.length} entries
                    </div>
                    <div>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            style={{
                                padding: "8px 18px",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                borderRadius: "6px",
                                border: "1px solid #007BFF",
                                backgroundColor: currentPage === 1 ? "#ddd" : "#007BFF",
                                color: currentPage === 1 ? "#999" : "white",
                                fontWeight: "bold",
                                marginRight: "8px",
                                userSelect: "none",
                            }}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages || totalPages === 0}
                            style={{
                                padding: "8px 18px",
                                cursor:
                                    currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                                borderRadius: "6px",
                                border: "1px solid #007BFF",
                                backgroundColor:
                                    currentPage === totalPages || totalPages === 0 ? "#ddd" : "#007BFF",
                                color: currentPage === totalPages || totalPages === 0 ? "#999" : "white",
                                fontWeight: "bold",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </MDBox>
    );
}
