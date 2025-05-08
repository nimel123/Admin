import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
        <LocationOnIcon sx={{ fontSize: 30 }} />
          Zone List</h2>
        <button onClick={handleAdd} style={styles.addButton}>+ Add Location</button>
      </div>

      {loading ? (
        <p style={styles.loadingText}>Loading locations...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>ID</th>
              <th style={styles.tableCell}>Address</th>
              <th style={styles.tableCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{user._id}</td>
                <td style={styles.tableCell}>{user.address}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => handleEdit(user._id)}
                    style={styles.editBtn}
                  >
                  <EditIcon style={{ fontSize: "24px" }} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={styles.deleteBtn}
                  >
                    <DeleteIcon style={styles.icon} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    paddingLeft: "170px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#007bff",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    color: "#333",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "16px",
  },
  tableRow: {
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  },
  tableCell: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "14px",
  },
  editBtn: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
 
  // Hover Effects
  tableRowHover: {
    backgroundColor: "#f5f9ff", // Light blue color on hover
  },

  editBtnHover: {
    backgroundColor: "#218838", // Darker green when hovered
  },

  deleteBtnHover: {
    backgroundColor: "#c82333", // Darker red when hovered
  },
};

export default Table;
