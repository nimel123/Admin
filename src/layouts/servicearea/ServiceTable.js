import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Table() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/getlocations");
        const json = await res.json();
        setData(json.result); // assuming json is an array of objects like [{ _id, address }]
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
    alert(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user with ID: ${id}`);
  };

  return (
    <div style={{ padding: "30px", paddingLeft: "150px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Avaliable Locations</h2>
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Location
        </button>
      </div>

      {loading ? (
        <p>Loading Locations...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>ADDRESS</th>
              <th style={thStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user._id}</td>
                <td style={tdStyle}>{user.address}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(user.id)} style={editBtn}>Edit</button>
                  <button onClick={() => handleDelete(user.id)} style={deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const editBtn = {
  padding: "5px 10px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  marginRight: "5px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "5px 10px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Table;
