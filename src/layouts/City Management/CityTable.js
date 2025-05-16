import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";

const initialCities = [
    { id: 1, name: "New York", zones: ["Manhattan", "Brooklyn", "Queens"], active: true },
    { id: 2, name: "Los Angeles", zones: ["Hollywood", "Beverly Hills"], active: false },
    { id: 3, name: "Chicago", zones: ["North Side", "South Side"], active: true },
    { id: 4, name: "Houston", zones: ["Downtown", "Midtown", "Uptown"], active: false },
    { id: 5, name: "Phoenix", zones: ["Encanto", "Alhambra"], active: true },
    { id: 6, name: "Philadelphia", zones: ["Center City", "Old City"], active: true },
    { id: 7, name: "San Antonio", zones: ["Downtown", "Alamo Heights"], active: false },
    { id: 8, name: "San Diego", zones: ["La Jolla", "Gaslamp Quarter"], active: true },
    { id: 9, name: "Dallas", zones: ["Deep Ellum", "Bishop Arts"], active: true },
    { id: 10, name: "San Jose", zones: ["Downtown", "Willow Glen"], active: false },
];

export default function CityTable() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    const [cities, setCities] = useState(initialCities);
    const [entriesToShow, setEntriesToShow] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter cities by search
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

    // Toggle status handler - optional if you want to toggle by clicking text or button
    const toggleStatus = (id) => {
        setCities((prev) =>
            prev.map((city) => (city.id === id ? { ...city, active: !city.active } : city))
        );
    };

    // Edit city
    const handleEdit = (city) => {
        alert(`Edit city: ${city.name}`);
        // You can navigate or open modal here
    };

    // Delete city
    const handleDelete = (city) => {
        if (window.confirm(`Are you sure you want to delete ${city.name}?`)) {
            setCities((prev) => prev.filter((c) => c.id !== city.id));
        }
    };

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "40px" }}>
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "auto",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    borderRadius: "10px",
                    padding: "25px",
                    backgroundColor: "white",
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
                        <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>City Lists</h2>
                        <p style={{ margin: 0, fontSize: "18px", color: "#555" }}>View and manage all cities</p>
                    </div>
                    <button
                        onClick={() => navigate("/city")}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            fontSize: "20px",
                            borderRadius: "25px",
                            padding: "12px 25px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 12px rgba(0,128,0,0.5)",
                            letterSpacing: "1px",
                        }}
                    >
                        + Create City
                    </button>
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
                        <label style={{ fontSize: 17 }}>Show&nbsp;</label>
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
                        <label style={{ fontSize: 17 }}>&nbsp;entries</label>
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
                        overflowX: "auto",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: '"Urbanist", sans-serif',
                            fontSize: "17px",
                            border: "1px solid #007BFF",
                            borderRadius: "10px",
                            overflow: "hidden",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
                                <th
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "14px 24px",
                                        textAlign: "left",
                                        width: "25%",
                                    }}
                                >
                                    City
                                </th>
                                {/* <th
                  style={{
                    border: "1px solid #0056b3",
                    padding: "14px 24px",
                    textAlign: "left",
                    width: "40%",
                  }}
                >
                  Zones (Total:{" "}
                  {currentCities.reduce((acc, city) => acc + city.zones.length, 0)})
                </th> */}
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
                                currentCities.map((city) => (
                                    <tr key={city.id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td
                                            style={{
                                                border: "1px solid #ddd",
                                                padding: "14px 24px",
                                            }}
                                        >
                                            {city.name}
                                        </td>
                                        {/* <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "14px 24px",
                      }}
                    >
                      {city.zones.join(", ")}
                      <br />
                      <small style={{ color: "#666" }}>Total Zones: {city.zones.length}</small>
                    </td> */}
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
                                            onClick={() => toggleStatus(city.id)} // Optional: toggle on click text
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
                                                onClick={() => handleDelete(city)}
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
                                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
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
