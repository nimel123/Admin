import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Switch,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default function Drivers() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDriverData, setEditDriverData] = useState({
    driverName: "",
    status: false,
    image: null,
    address: { city: "", locality: "", mobileNo: "" },
  });
  const [searchLocation, setSearchLocation] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("https://api.fivlia.in/getDriver");
        const data = await response.json();

        if (Array.isArray(data.Driver)) {
          const formattedDrivers = data.Driver.map((driver) => ({
            id: driver._id,
            name: driver.driverName || "",
            driverId: driver.driverId || "",
            status: driver.status === "true" || driver.status === true,
            image: driver.image || "",
            address: driver.address || {},
          }));
          setDrivers(formattedDrivers);
        } else {
          setError("Invalid driver data format");
        }
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
        setError("Failed to fetch drivers. Please try again.");
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

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

  const toggleStatus = async (id) => {
    const driverToUpdate = drivers.find((d) => d.id === id);
    if (!driverToUpdate) return;

    const newStatus = !driverToUpdate.status;

    try {
      const response = await fetch(
        `https://api.fivlia.in/editDriver/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setDrivers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError(`Failed to update status: ${error.message}`);
    }
  };

  const handleEditDriver = async () => {
    if (!selectedDriver) return;

    const formData = new FormData();
    formData.append("driverName", editDriverData.driverName);
    formData.append("status", editDriverData.status);
    formData.append("address", JSON.stringify(editDriverData.address));
    if (editDriverData.image) {
      formData.append("image", editDriverData.image);
    }

    try {
      const response = await fetch(
        `https://api.fivlia.in/editDriver/${selectedDriver.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update driver");
      }

      const updated = await response.json();
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === selectedDriver.id
            ? {
                ...d,
                name: updated.edit?.driverName || d.name,
                status: updated.edit?.status,
                image: updated.edit?.image || d.image,
                address: updated.edit?.address || d.address,
              }
            : d
        )
      );
      setEditModalOpen(false);
      setSelectedDriver(null);
      setEditDriverData({
        driverName: "",
        status: false,
        image: null,
        address: { city: "", locality: "", mobileNo: "" },
      });
    } catch (error) {
      console.error("Error updating driver:", error);
      setError(`Failed to update driver: ${error.message}`);
    }
  };

  const handleOpenEditModal = (driver) => {
    setSelectedDriver(driver);
    setEditDriverData({
      driverName: driver.name,
      status: driver.status,
      image: null,
      address: {
        city: driver.address?.city || "",
        locality: driver.address?.locality || "",
        mobileNo: driver.address?.mobileNo || "",
      },
    });
    setEditModalOpen(true);
  };

  return (
    <MDBox ml={miniSidenav ? "80px" : "250px"} p={2} sx={{ marginTop: "30px" }}>
      <div style={{ width: "100%", padding: "0 20px" }}>
        {/* Header */}
        <div
          style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
              Driver List
            </h2>
            <p style={{ margin: 0, fontSize: "18px", color: "#555" }}>
              View and manage all drivers
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
            onClick={() => navigate("/add-driver")}
          >
            + Add Driver
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
              placeholder="Search drivers..."
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

        {/* Error Message */}
        {error && (
          <div style={{ color: "red", textAlign: "center", margin: "10px 0" }}>
            {error}
          </div>
        )}

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
              <th style={headerCell}>Driver ID</th>
              <th style={headerCell}>Driver Name</th>
              <th style={headerCell}>Mobile No</th>
              <th style={headerCell}>Address</th>
              <th style={headerCell}>Status</th>
              <th style={headerCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers.length > 0 ? (
              currentDrivers.map((driver, index) => (
                <tr
                  key={driver.id}
                  style={{
                    backgroundColor:
                      selectedDriver?.id === driver.id ? "#f1f1f1" : "white",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ ...bodyCell, textAlign: "center" }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={bodyCell}>{driver.driverId}</td>
                  <td style={{ ...bodyCell, display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar src={driver.image} alt={driver.name} sx={{ width: 40, height: 40 }} />
                    <span>{driver.name}</span>
                  </td>
                  <td style={bodyCell}>{driver.address?.mobileNo || "-"}</td>
                  <td style={{ ...bodyCell, textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setSelectedDriver(driver);
                        setSearchLocation(driver.address?.locality || driver.address?.city || "");
                        setModalOpen(true);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #007bff",
                        backgroundColor: "white",
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      View Address
                    </button>
                  </td>
                  <td style={{ ...bodyCell, textAlign: "center" }}>
                    <Switch
                      checked={driver.status}
                      onChange={() => toggleStatus(driver.id)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "green" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "green !important",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "red",
                          opacity: 1,
                        },
                      }}
                    />
                  </td>
                  <td style={{ ...bodyCell, textAlign: "center" }}>
                    <button
                      onClick={() => handleOpenEditModal(driver)}
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
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No drivers found.
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
            {Math.min(endIndex, filteredDrivers.length)} of{" "}
            {filteredDrivers.length} entries
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

      {/* Address Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Driver Address Details</DialogTitle>
        <DialogContent dividers>
          {selectedDriver?.address ? (
            <>
              <div><b>📍 City:</b> {selectedDriver.address.city}</div>
              <div><b>🏠 Locality:</b> {selectedDriver.address.locality}</div>
              <div><b>📞 Mobile:</b> {selectedDriver.address.mobileNo}</div>

              <TextField
                label="Search Location"
                fullWidth
                margin="normal"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </>
          ) : (
            <div>No address info available.</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Driver Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Driver Name"
            fullWidth
            margin="normal"
            value={editDriverData.driverName}
            onChange={(e) =>
              setEditDriverData((prev) => ({ ...prev, driverName: e.target.value }))
            }
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            value={editDriverData.address.city}
            onChange={(e) =>
              setEditDriverData((prev) => ({
                ...prev,
                address: { ...prev.address, city: e.target.value },
              }))
            }
          />
          <TextField
            label="Locality"
            fullWidth
            margin="normal"
            value={editDriverData.address.locality}
            onChange={(e) =>
              setEditDriverData((prev) => ({
                ...prev,
                address: { ...prev.address, locality: e.target.value },
              }))
            }
          />
          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={editDriverData.address.mobileNo}
            onChange={(e) =>
              setEditDriverData((prev) => ({
                ...prev,
                address: { ...prev.address, mobileNo: e.target.value },
              }))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editDriverData.status}
                onChange={(e) =>
                  setEditDriverData((prev) => ({ ...prev, status: e.target.checked }))
                }
              />
            }
            label="Active Status"
          />
          <TextField
            label="Upload Image"
            type="file"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
            onChange={(e) =>
              setEditDriverData((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleEditDriver} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}