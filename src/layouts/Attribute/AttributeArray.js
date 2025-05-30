import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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
};

function AttributeTable() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [attribute, setAttribute] = useState([]);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const res = await fetch("https://fivlia.onrender.com/getAttributes");
        const data = await res.json();
        setAttribute(data);
        console.log(data);

      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchAttribute();
  }, []);


  const handleRemoveVariant = async (variantId) => {
     const confirmDelete = window.confirm("Are you sure you want to delete this Varient?");
      if (!confirmDelete) return;
  try {
    // Make DELETE request to backend
    const res = await fetch(`http://localhost:5000/deleteVarient/${variantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status===200) {
      alert('Success')
      setAttribute(prevAttributes =>
        prevAttributes.map(attr => ({
          ...attr,
          varient: attr.varient.filter(v => v._id !== variantId)
        }))
      );
      
    }

   
   
  } catch (error) {
    console.error("Error deleting variant:", error);
    alert("Failed to delete variant. Please try again.");
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
              <span style={{ fontWeight: "bold", fontSize: 26 }}>Attribute Lists</span>
              <br />
              <span style={{ fontSize: 17 }}>View and manage all attributes</span>
            </div>
            <div>
              <Button
                style={{
                  backgroundColor: "#00c853",
                  height: 50,
                  width: 170,
                  fontSize: 12,
                  color: "white",
                  letterSpacing: "1px",
                }}
                onClick={() => navigate("/add-attribute")}
              >
                + Add Attribute
              </Button>
            </div>
          </div>

          {/* Table and pagination remain unchanged */}
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
                  <th style={headerCell}>Item Attribute Name</th>
                  <th style={headerCell}>Item Varinets Value</th>
                  <th style={{ ...headerCell, textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {attribute.map((item, index) => (
                  <tr key={item._id}>
                    <td style={bodyCell}>{index + 1}</td>
                    <td style={bodyCell}>{item.Attribute_name}</td>
                    <td style={bodyCell}>
                      {item.varient && item.varient.length > 0 ? (
                        item.varient.map((v, i) => (
                          <span
                            key={i}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              backgroundColor: "#e0f7fa",
                              color: "#00796b",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              marginRight: "6px",
                              marginBottom: "4px",
                              fontSize: "14px",
                              userSelect: "none",
                            }}
                          >
                            {v.name}
                            <button
                              onClick={() => handleRemoveVariant(v._id)}
                              style={{
                                marginLeft: 6,
                                background: "transparent",
                                border: "none",
                                color: "#00796b",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "16px",
                                lineHeight: 1,
                                padding: 0,
                              }}
                              aria-label={`Remove variant ${v.name}`}
                              type="button"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#aaa" }}>—</span>
                      )}

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
                          onClick={() => navigate('/edit-attribute', { state: item })}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
          </div>
        </div>
      </div>
    </MDBox>
  );
}

export default AttributeTable;
