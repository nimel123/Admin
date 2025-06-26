import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function StatusManagement() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newStatusCode, setNewStatusCode] = useState("");
  const [newStatusTitle, setNewStatusTitle] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const headerCell = {
    padding: "14px 12px",
    border: "1px solid #ddd",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
  };

  const bodyCell = {
    padding: "12px",
    border: "1px solid #eee",
    fontSize: 17,
    backgroundColor: "#fff",
    textAlign: "center",
  };

  // Fetch statuses on mount
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("https://fivlia.onrender.com/getdeliveryStatus");
        const data = await response.json();
        if (response.ok && Array.isArray(data.Status)) {
          setStatuses(data.Status.map((s) => ({
            id: s._id,
            statusCode: s.statusCode || "",
            statusTitle: s.statusTitle || "",
            isActive: s.status || false,
          })));
        } else {
          throw new Error(data.message || "Failed to fetch statuses");
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        alert("Failed to fetch statuses. Try again.");
      }
    };
    fetchStatuses();
  }, []);

  const toggleStatus = async (id) => {
    const statusToUpdate = statuses.find((s) => s.id === id);
    if (!statusToUpdate) return;

    const newStatus = !statusToUpdate.isActive;

    try {
      const response = await fetch(`https://fivlia.onrender.com/fivlia/updatedeliveryStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update status");

      setStatuses((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: newStatus } : s))
      );
    } catch (error) {
      alert("Failed to update status. Try again.");
      console.error("Toggle status error:", error);
    }
  };

  const handleAddSave = async () => {
    if (!newStatusCode || !newStatusTitle) {
      alert("Please fill in all fields");
      return;
    }
    const newStatus = {
      statusCode: newStatusCode,
      statusTitle: newStatusTitle,
      status: true,
    };
    try {
      const response = await fetch("https://fivlia.onrender.com/deliveryStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create status");

      setStatuses((prev) => [
        ...prev,
        {
          id: data.newStatus._id,
          statusCode: data.newStatus.statusCode,
          statusTitle: data.newStatus.statusTitle,
          isActive: data.newStatus.status,
        },
      ]);
      setModalOpen(false);
      setNewStatusCode("");
      setNewStatusTitle("");
    } catch (error) {
      alert("Failed to create status. Try again.");
      console.error("Create status error:", error);
    }
  };

  const handleEdit = (status) => {
    setSelectedStatus(status);
    setNewStatusCode(status.statusCode);
    setNewStatusTitle(status.statusTitle);
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!newStatusCode || !newStatusTitle) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch(`https://fivlia.onrender.com/fivlia/updatedeliveryStatus/${selectedStatus.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusCode: newStatusCode,
          statusTitle: newStatusTitle,
          status: selectedStatus.isActive,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update status");

      setStatuses((prev) =>
        prev.map((s) =>
          s.id === selectedStatus.id
            ? {
                ...s,
                statusCode: newStatusCode,
                statusTitle: newStatusTitle,
              }
            : s
        )
      );
      setEditModalOpen(false);
      setSelectedStatus(null);
      setNewStatusCode("");
      setNewStatusTitle("");
    } catch (error) {
      alert("Failed to update status. Try again.");
      console.error("Update status error:", error);
    }
  };

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

  const filteredStatuses = statuses.filter((s) =>
    s.statusCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.statusTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStatuses.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const currentStatuses = filteredStatuses.slice(startIndex, endIndex);

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "30px" }}>
      <div style={{ width: "100%", padding: "0 20px" }}>
        {/* Header */}
        <div
          style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
              Status Management
            </h2>
            <p style={{ margin: 0, fontSize: "18px", color: "#555" }}>
              Manage order statuses
            </p>
          </div>
          <Button
            style={{
              backgroundColor: "#00c853",
              height: 45,
              width: 150,
              fontSize: 12,
              color: "white",
              letterSpacing: "1px",
            }}
            onClick={() => setModalOpen(true)}
          >
            + Add Status
          </Button>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 17 }}>Show Entries </label>
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
          <div style={{ marginLeft: "420px" }}>
            <label style={{ fontSize: 17, marginRight: 8 }}>Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search statuses..."
              style={{
                padding: "8px 34px",
                borderRadius: "8px",
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: '"Urbanist", sans-serif',
            fontSize: "17px",
            border: "1px solid #007BFF",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={headerCell}>Sr No</th>
              <th style={headerCell}>Status Code</th>
              <th style={headerCell}>Status Title</th>
              <th style={headerCell}>Status</th>
              <th style={headerCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStatuses.length > 0 ? (
              currentStatuses.map((status, index) => (
                <tr
                  key={status.id}
                  style={{
                    backgroundColor: selectedStatus?.id === status.id ? "#f1f1f1" : "white",
                    cursor: "pointer",
                  }}
                >
                  <td style={bodyCell}>{startIndex + index + 1}</td>
                  <td style={bodyCell}>{status.statusCode}</td>
                  <td style={bodyCell}>{status.statusTitle}</td>
                  <td style={bodyCell}>
                    <Switch
                      checked={status.isActive}
                      onChange={() => toggleStatus(status.id)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#00c853" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#00c853 !important",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "red",
                          opacity: 1,
                        },
                      }}
                    />
                  </td>
                  <td style={bodyCell}>
                    <button
                      onClick={() => handleEdit(status)}
                      style={{
                        backgroundColor: "#007BFF",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No statuses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}
        >
          <div>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredStatuses.length)} of{" "}
            {filteredStatuses.length} entries
          </div>
          <div>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              style={{
                padding: "8px 18px",
                backgroundColor: currentPage === 1 ? "#ccc" : "#007BFF",
                color: currentPage === 1 ? "#666" : "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                marginRight: "8px",
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 18px",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#007BFF",
                color: currentPage === totalPages ? "#666" : "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Status Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Status</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Status Title"
            fullWidth
            margin="normal"
            value={newStatusTitle}
            onChange={(e) => setNewStatusTitle(e.target.value)}
            placeholder="e.g., Pending"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Status Title"
            fullWidth
            margin="normal"
            value={newStatusTitle}
            onChange={(e) => setNewStatusTitle(e.target.value)}
            placeholder="e.g., Pending"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}