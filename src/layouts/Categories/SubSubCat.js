import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch } from "@mui/material";

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
  paddingLeft: "30px",
};

function SubSubCat() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();
  const location = useLocation();
  const subcategory = location.state?.subcat;
  console.log(subcategory);
  

  const [toggleStates, setToggleStates] = useState({});

  useEffect(() => {
    const initialToggles = {};
    subcategory?.subsubcat?.forEach((item) => {
      initialToggles[item._id] = true;
    });
    setToggleStates(initialToggles);
  }, [subcategory]);

  const handleToggle = (id) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    // Optional: update backend here
  };

  const handleDeleteSubSubcat = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this sub-subcategory?");
    if (!confirm) return;

    try {
      const res = await fetch(`https://node-m8jb.onrender.com/deletesubsubcategory/${id}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        alert("Deleted successfully");
        window.location.reload();
      }
    } catch (err) {
      console.error("Delete error:", err);
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
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontWeight: "bold", fontSize: 26 }}>Sub-SubCategories List</span>
            <br />
            <span style={{ fontSize: 17 }}>
              View and manage all Sub-SubCategories of {subcategory?.name}
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr>
                  <th style={{ ...headerCell, width: "8%" }}>Sr. No</th>
                  <th style={headerCell}>Sub-SubCategory Name</th>
                  <th style={headerCell}>Public</th>
                  <th style={{ ...headerCell, width: "20%", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {subcategory?.subsubcat?.map((subsub, index) => (
                  <tr key={subsub._id}>
                    <td style={{ ...bodyCell, textAlign: "center" }}>{index + 1}</td>
                    <td style={{ ...bodyCell }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <img
                          src={subsub.image}
                          alt={subsub.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span>{subsub.name}</span>
                      </div>
                    </td>
                    <td style={{ ...bodyCell, textAlign: "center" }}>
                      <Switch
                        checked={toggleStates[subsub._id] || false}
                        onChange={() => handleToggle(subsub._id)}
                        color="primary"
                      />
                    </td>
                    <td style={{ ...bodyCell, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <button
                          style={{
                            backgroundColor: "#007BFF",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
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
                          onClick={() => handleDeleteSubSubcat(subsub._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MDBox>
  );
}

export default SubSubCat;
