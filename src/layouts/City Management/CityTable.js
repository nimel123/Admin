import React, { useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import './CityTable.css';
import { useNavigate } from "react-router-dom";

const dummyCities = [
    { id: 1, name: "New York" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Chicago" },
    { id: 4, name: "Houston" },
    { id: 5, name: "Phoenix" },
    { id: 6, name: "Philadelphia" },
    { id: 7, name: "San Antonio" },
    { id: 8, name: "San Diego" },
    { id: 9, name: "Dallas" },
    { id: 10, name: "San Jose" },
    // Add more if needed
];

function CityTable() {
    const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;
    const navigate = useNavigate();

    // Pagination and search states
    const [entriesToShow, setEntriesToShow] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter cities based on search term
    const filteredCities = dummyCities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination details
    const totalPages = Math.ceil(filteredCities.length / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const endIndex = startIndex + entriesToShow;
    const currentCities = filteredCities.slice(startIndex, endIndex);

    // Handle changing entries count
    const handleEntriesChange = (e) => {
        setEntriesToShow(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset to first page
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    // Pagination controls
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "40px" }}>
            <div className="city-container">
                <div className="add-city-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <span style={{ fontWeight: 'bold', fontSize: 25 }}>City Lists</span>
                            <br />
                            <span style={{ fontSize: 16 }}>View and manage all cities</span>
                        </div>
                        <div>
                            <button
                                style={{
                                    backgroundColor: 'green',
                                    height: 45,
                                    width: 150,
                                    fontSize: 19,
                                    color: 'white',
                                    borderRadius: 20,
                                    wordSpacing: 2,
                                    letterSpacing: '1px',
                                    borderColor: 'white',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                }}
                                onClick={() => navigate('/city')}
                            >
                                + Create City
                            </button>
                        </div>
                    </div>

                    {/* Controls: Show entries + Search */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: 15 }}>Show</span>&nbsp;
                            <select value={entriesToShow} onChange={handleEntriesChange}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={20}>30</option>
                            </select>
                            &nbsp;
                            <span style={{ fontSize: 15 }}>entries</span>
                        </div>
                        <div>
                            Search:&nbsp;
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search cities..."
                                style={{ padding: '5px', borderRadius: '20px', height: '40px', width: '190px', border: '1px solid #ccc', fontSize: 17, paddingLeft: '15px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <table
                            style={{
                                width: '100%',
                                borderColor:'black',
                                borderCollapse:'collapse',
                                fontFamily: '"Urbanist", sans-serif',
                                fontSize: '15px',
                                border: '1px solid black',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: '#eaeaea' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '12px 20px', textAlign: 'left', width: '25%',fontSize:19 }}>Name</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px 20px', textAlign: 'left', width: '40%',fontSize:19  }}>Zones</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px 20px', textAlign: 'left', width: '15%',fontSize:19  }}>Status</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px 20px', textAlign: 'left', width: '20%',fontSize:19  }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '12px 20px' }}>Sirsa</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px 20px' }}>Ottu</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px 20px' }}>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px 20px' }}>
                                        <button style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Edit</button>
                                        <button style={{ padding: '6px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>




                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15, gap: 10 }}>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Previous
                        </button>
                        <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </MDBox>
    );
}

export default CityTable;
