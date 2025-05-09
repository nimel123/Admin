import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './Table.css';
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";

function Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
   const [controller] = useMaterialUIController();
    const { miniSidenav } = controller;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://node-m8jb.onrender.com/getlocations");
        const json = await res.json();
        setData(json.result);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    navigate("/addlocation");
  };

  const handleEdit = (id) => {
    navigate("/addlocation", { state: { id } });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this location?");
    if (!confirmDelete) return;

    try {
      const result = await fetch(`https://node-m8jb.onrender.com/deletezone/${id}`, {
        method: "DELETE",
      });

      if (result.status === 200) {
        alert("Location deleted successfully");
        setData(data.filter((item) => item._id !== id));
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastEntry = currentPage * itemsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
  const currentEntries = data.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          <LocationOnIcon sx={{ fontSize: 30 }} /> Zone List
        </h2>
        <button onClick={handleAdd} className="add-button">+ Add Location</button>
      </div>

      {/* Entries Dropdown */}
      <div className="entries-dropdown">
        <label style={{fontSize:15,color:'green'}}>Show entries: </label>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{backgroundColor:'skyblue'}}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading locations...</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th className="table-cell">ID</th>
                <th className="table-cell">Zone Name</th>
                <th className="table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((user) => (
                <tr key={user._id} className="table-row">
                  <td className="table-cell">{user._id}</td>
                  <td className="table-cell">{user.address}</td>
                  <td className="table-cell">
                    <button onClick={() => handleEdit(user._id)} className="edit-btn">
                      <EditIcon style={{ fontSize: "24px" }} />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="delete-btn">
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(i + 1)}
                className={currentPage === i + 1 ? "active-page" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
    </MDBox>
  );
}

export default Table;
