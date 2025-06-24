import React, { useState, useEffect, useCallback } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import Modal from "@mui/material/Modal";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { CSVLink } from "react-csv";

const DeliveryStatus = () => {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [zones, setZones] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, storesRes, zonesRes, driversRes] = await Promise.all([
        fetch("https://fivlia.onrender.com/orders"),
        fetch("https://fivlia.onrender.com/getStore"),
        fetch("https://fivlia.onrender.com/getAllZone"),
        fetch("https://fivlia.onrender.com/getDriver"),
      ]);

      // Orders
      const ordersData = await ordersRes.json();
      console.log("Orders API response:", ordersData);
      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      } else {
        alert("Failed to load orders: Invalid data format");
      }

      // Stores
      const storesData = await storesRes.json();
      console.log("Stores API response:", storesData);
      if (storesData.stores && Array.isArray(storesData.stores)) {
        const mappedStores = storesData.stores.map((s) => ({
          id: s._id.$oid || s._id,
          name: s.storeName || "Unknown",
          address: s.Latitude && s.Longitude ? `${s.Latitude}, ${s.Longitude}` : s.city?.name || "Unknown",
        }));
        setStores(mappedStores);
      } else {
        alert("Failed to load stores");
      }

      // Zones
      const zonesData = await zonesRes.json();
      console.log("Zones API response:", zonesData);
      if (Array.isArray(zonesData)) {
        const zoneList = zonesData.reduce((acc, city) => {
          if (city?.zones && Array.isArray(city.zones)) {
            return [
              ...acc,
              ...city.zones.map((zone) => ({
                id: zone._id.$oid || zone._id,
                name: zone.zoneTitle || "Unknown",
                city: city.city || "Unknown",
              })),
            ];
          }
          return acc;
        }, []);
        setZones(zoneList);
      } else {
        alert("Failed to load zones");
      }

      // Drivers
      const driversData = await driversRes.json();
      console.log("Drivers API response:", driversData);
      if (driversData.Driver && Array.isArray(driversData.Driver)) {
        setDrivers(driversData.Driver.map((d) => ({
          id: d._id,
          name: d.driverName || "Unknown",
          status: d.status === "true" ? "Available" : "Inactive",
        })));
      } else {
        alert("Failed to load drivers");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setOrders((prev) =>
      [...prev].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
        if (key === "items[0].name") {
          aValue = a.items?.[0]?.name || "";
          bValue = b.items?.[0]?.name || "";
        }
        if (key === "addressId.fullAddress") {
          aValue = a.addressId?.fullAddress || "";
          bValue = b.addressId?.fullAddress || "";
        }
        if (key === "storeId.storeName") {
          aValue = a.storeId?.storeName || "";
          bValue = b.storeId?.storeName || "";
        }
        if (key === "driverId.name") {
          aValue = a.driverId?.name || "";
          bValue = b.driverId?.name || "";
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`https://fivlia.onrender.com/orderStatus/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus } : order))
        );
        setSelectedOrder((prev) => (prev?._id === orderId ? { ...prev, orderStatus: newStatus } : prev));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDriverAssignment = async (orderId, driverId) => {
    setLoading(true);
    try {
      const res = await fetch(`https://fivlia.onrender.com/orders/${orderId}/assign-driver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ driverId }),
      });
      if (res.ok) {
        const driver = drivers.find((d) => d.id === driverId) || { id: null, name: "Unassigned" };
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, driverId: driver } : order
          )
        );
        setSelectedOrder((prev) =>
          prev?._id === orderId ? { ...prev, driverId: driver } : prev
        );
      } else {
        alert("Failed to assign driver");
      }
    } catch (err) {
      alert("Error assigning driver");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (order._id && order._id.toLowerCase().includes(search)) ||
      (order.items?.[0]?.name && order.items[0].name.toLowerCase().includes(search)) ||
      (order.addressId?.fullAddress || "").toLowerCase().includes(search) ||
      (order.orderStatus && order.orderStatus.toLowerCase().includes(search)) ||
      (order.storeId?.storeName || "").toLowerCase().includes(search) ||
      (order.driverId?.name || "").toLowerCase().includes(search);

    const matchesStore = !selectedStore || String(order.storeId?._id) === String(selectedStore);
    const matchesZone =
      !selectedZone ||
      zones.some((zone) => zone.id === selectedZone && zone.city === order.city);
    const matchesStatus = !selectedStatus || order.orderStatus === selectedStatus;
    const matchesDriver = !selectedDriver || String(order.driverId?.id) === String(selectedDriver);

    return matchesSearch && matchesStore && matchesZone && matchesStatus && matchesDriver;
  });

  const totalPages = Math.ceil(filteredOrders.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + entriesToShow);

  const csvData = filteredOrders.map((order, index) => ({
    No: startIndex + index + 1,
    OrderID: order._id,
    Item: order.items?.[0]?.name || "-",
    Quantity: order.items?.[0]?.quantity || 0,
    Price: order.items?.[0]?.price || 0,
    Total: order.totalPrice || "-",
    Address: order.addressId?.fullAddress || "-",
    Status: order.orderStatus || "-",
    Store: order.storeId?.storeName || "-",
    Driver: order.driverId?.name || "-",
    PaymentStatus: order.paymentStatus || "-",
    CashOnDelivery: order.cashOnDelivery ? "Yes" : "No",
  }));

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap');
          .order-container {
            font-family: 'Urbanist', sans-serif;
            padding: 16px;
            width: 100%;
          }
          .order-box {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .controls-container {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 20px;
            align-items: center;
          }
          .control-item {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 140px;
          }
          .control-item label {
            font-size: 14px;
            font-weight: 600;
            color: #344767;
            white-space: nowrap;
          }
          .control-item select, .control-item input {
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            font-size: 14px;
            width: 100%;
            outline: none;
            transition: border-color 0.2s;
          }
          .control-item select:focus, .control-item input:focus {
            border-color: #007bff;
          }
          .search-input {
            border-radius: 20px;
            padding-left: 16px;
          }
          .table-container {
            overflow-x: auto;
            position: relative;
          }
          .orders-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #007bff;
          }
          .header-cell {
            padding: 12px;
            font-size: 14px;
            font-weight: 600;
            background: #007bff;
            color: white;
            text-align: left;
            cursor: pointer;
            user-select: none;
          }
          .header-cell:hover {
            background: #0056b3;
          }
          .body-cell {
            padding: 12px;
            font-size: 12px;
            border-bottom: 1px solid #f0f0f0;
            color: #344767;
            text-align: center;
          }
          .item-link {
            color: #007bff;
            cursor: pointer;
            text-decoration: none;
          }
          .item-link:hover {
            color: #0056b3;
            text-decoration: underline;
          }
          .view-button {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
          }
          .view-button:hover {
            background: #0056b3;
          }
          .status-badge {
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: normal;
            text-transform: capitalize;
          }
          .status-accepted { background: #e6f4ea; color: #2e7d32; }
          .status-pending { background: #fff3e0; color: #f57c00; }
          .status-delivered { background: #e8f0fe; color: #1e88e5; }
          .status-cancelled { background: #ffebee; color: #d32f2f; }
          .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            flex-wrap: wrap;
            gap: 12px;
          }
          .pagination button {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
            min-width: 40px;
          }
          .pagination button:disabled {
            background: #e0e0e0;
            cursor: not-allowed;
          }
          .modal-content {
            background: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 600px;
            margin: 40px auto;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          }
          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            color: #344767;
            font-size: 18px;
          }
          .refresh-button, .export-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
          }
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            border-radius: 8px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .controls-container {
              flex-direction: column;
            }
            .control-item {
              width: 100%;
            }
            .modal-content {
              margin: 20px;
              max-width: 90%;
            }
            .orders-table {
              font-size: 12px;
            }
            .header-cell, .body-cell {
              padding: 8px;
            }
          }
        `}
      </style>
      <MDBox
        p={2}
        style={{
          marginLeft: miniSidenav ? "80px" : "250px",
          transition: "margin-left 0.3s ease",
          position: "relative",
          width: `calc(100% - ${miniSidenav ? "80px" : "250px"})`,
        }}
      >
        <div className="order-container">
          <div className="order-box">
            <div className="header">
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#344767" }}>Orders Management</h2>
                <p style={{ fontSize: "14px", color: "#7b809a" }}>View, manage orders, and assign drivers</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="refresh-button" onClick={fetchData} disabled={loading}>
                  Refresh
                </button>
                <CSVLink data={csvData} filename={"orders.csv"} className="export-button">
                  Export CSV
                </CSVLink>
              </div>
            </div>

            <div className="controls-container">
              <div className="control-item">
                <label>Show Entries</label>
                <select value={entriesToShow} onChange={(e) => { setEntriesToShow(Number(e.target.value)); setCurrentPage(1); }}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="control-item">
                <label>Zone</label>
                <select value={selectedZone} onChange={(e) => { setSelectedZone(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Zones</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              <div className="control-item">
                <label>Store</label>
                <select value={selectedStore} onChange={(e) => { setSelectedStore(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Stores</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div className="control-item">
                <label>Status</label>
                <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="control-item">
                <label>Driver</label>
                <select value={selectedDriver} onChange={(e) => { setSelectedDriver(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Drivers</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              <div className="control-item">
                <label>Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search"
                  className="search-input"
                />
              </div>
            </div>

            <div className="table-container">
              {loading && (
                <div className="loading-overlay">
                  <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #007bff", borderRadius: "50%", width: "24px", height: "24px", animation: "spin 1s linear infinite" }}></div>
                </div>
              )}
              <table className="orders-table">
                <thead>
                  <tr>
                    <th className="header-cell" onClick={() => handleSort("index")}>
                      Sr No {sortConfig.key === "index" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell" onClick={() => handleSort("_id")}>
                      Order ID {sortConfig.key === "_id" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell" onClick={() => handleSort("items[0].name")}>
                      Item {sortConfig.key === "items[0].name" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell">
                      Address
                    </th>
                    <th className="header-cell" onClick={() => handleSort("storeId.storeName")}>
                      Store {sortConfig.key === "storeId.storeName" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell" onClick={() => handleSort("driverId.name")}>
                      Driver {sortConfig.key === "driverId.name" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell" onClick={() => handleSort("orderStatus")}>
                      Status {sortConfig.key === "orderStatus" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order, index) => {
                      const item = order.items?.[0];
                      return (
                        <tr key={order._id}>
                          <td className="body-cell">{startIndex + index + 1}</td>
                          <td className="body-cell">{order._id}</td>
                          <td className="body-cell">
                            <span
                              className="item-link"
                              onClick={() => setSelectedItem(item)}
                              title={item?.name}
                            >
                              {item?.name ? (item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name) : "-"}
                            </span>
                            <br />
                            <span style={{ color: "#7b809a", fontSize: "12px" }}>
                              Qty: {item?.quantity || 0} | ₹{item?.price || 0}
                            </span>
                          </td>
                          <td className="body-cell">
                            <button
                              className="view-button"
                              onClick={() => setSelectedAddress(order.addressId)}
                              disabled={!order.addressId}
                            >
                              View
                            </button>
                          </td>
                          <td className="body-cell">{order.storeId?.storeName || "-"}</td>
                          <td className="body-cell">
                            <select
                              value={order.driverId?.id || ""}
                              onChange={(e) => handleDriverAssignment(order._id, e.target.value)}
                              style={{
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #e0e0e0",
                                fontSize: "12px",
                              }}
                              disabled={loading}
                            >
                              <option value="">Unassigned</option>
                              {drivers
                                .filter((d) => d.status === "Available")
                                .map((driver) => (
                                  <option key={driver.id} value={driver.id}>
                                    {driver.name}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="body-cell">
                            <select
                              value={order.orderStatus || "Pending"}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              disabled={statusUpdating}
                              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #e0e0e0" }}
                            >
                              <option value="" disabled>Select Status</option>
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="body-cell" style={{ textAlign: "center", color: "#7b809a" }}>
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span style={{ fontSize: "14px", color: "#7b809a" }}>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesToShow, filteredOrders.length)} of {filteredOrders.length} orders
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      background: page === currentPage ? "#0056b3" : "#007bff",
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setSelectedOrder(null)}>×</span>
            {selectedOrder && (
              <>
                <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>Order Details - {selectedOrder._id}</h3>
                <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <strong>Item:</strong>{" "}
                    <span
                      className="item-link"
                      onClick={() => setSelectedItem(selectedOrder.items?.[0])}
                      title={selectedOrder.items?.[0]?.name}
                    >
                      {selectedOrder.items?.[0]?.name || "-"}
                    </span>
                  </div>
                  <div>
                    <strong>Quantity:</strong> {selectedOrder.items?.[0]?.quantity || 0}
                  </div>
                  <div>
                    <strong>Price:</strong> ₹{selectedOrder.items?.[0]?.price || 0}
                  </div>
                  <div>
                    <strong>Total:</strong> ₹{selectedOrder.totalPrice || "-"}
                  </div>
                  <div>
                    <strong>Address:</strong>{" "}
                    <button
                      className="view-button"
                      onClick={() => setSelectedAddress(selectedOrder.addressId)}
                      disabled={!selectedOrder.addressId}
                    >
                      View
                    </button>
                  </div>
                  <div>
                    <strong>Store:</strong> {selectedOrder.storeId?.storeName || "-"}
                  </div>
                  <div>
                    <strong>Driver:</strong>{" "}
                    <select
                      value={selectedOrder.driverId?.id || ""}
                      onChange={(e) => handleDriverAssignment(selectedOrder._id, e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0",
                      }}
                      disabled={loading}
                    >
                      <option value="">Unassigned</option>
                      {drivers
                        .filter((d) => d.status === "Available")
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <strong>Payment Status:</strong> {selectedOrder.paymentStatus || "-"}
                  </div>
                  <div>
                    <strong>Cash on Delivery:</strong> {selectedOrder.cashOnDelivery ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <select
                      value={selectedOrder.orderStatus || "Pending"}
                      onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                      disabled={statusUpdating}
                      style={{ padding: "8px", borderRadius: "6px", border: "1px solid #e0e0e0" }}
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>

        <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setSelectedItem(null)}>×</span>
            {selectedItem && (
              <>
                <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>Item Details</h3>
                <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <strong>Name:</strong> {selectedItem.name || "-"}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {selectedItem.quantity || "-"}
                  </div>
                  <div>
                    <strong>Price:</strong> ₹{selectedItem.price || "-"}
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>

        <Modal open={!!selectedAddress} onClose={() => setSelectedAddress(null)}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setSelectedAddress(null)}>×</span>
            {selectedAddress && (
              <>
                <h3 style={{ fontWeight: 600, marginBottom: "16px" }}>Address Details</h3>
                <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <strong>Full Name:</strong> {selectedAddress.fullName || "-"}
                  </div>
                  <div>
                    <strong>Address:</strong> {selectedAddress.fullAddress || "-"}
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      </MDBox>
    </>
  );
};

export default DeliveryStatus;