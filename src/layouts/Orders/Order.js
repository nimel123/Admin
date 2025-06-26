import React, { useState, useEffect, useCallback } from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import Modal from "@mui/material/Modal";
import { FaSortUp, FaSortDown, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { CSVLink } from "react-csv";

const Orders = () => {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [zones, setZones] = useState([]);
  const [variants, setVariants] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [driverUpdating, setDriverUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, storesRes, zonesRes, driversRes] = await Promise.all([
        fetch("https://fivlia.onrender.com/orders"),
        fetch("https://fivlia.onrender.com/getStore"),
        fetch("https://fivlia.onrender.com/getAllZone"),
        fetch("https://fivlia.onrender.com/getDriver"),
      ]);

      const ordersData = await ordersRes.json();
      console.log("Orders API response:", ordersData);
      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      } else {
        setError("Failed to load orders: Invalid data format");
      }

      const storesData = await storesRes.json();
      console.log("Stores API response:", storesData);
      if (storesData.stores && Array.isArray(storesData.stores)) {
        const mappedStores = storesData.stores.map((s) => ({
          id: s._id.$oid || s._id,
          name: s.storeName || "Unknown",
          address: s.Latitude && s.Longitude ? `${s.Latitude}, ${s.Longitude}` : s.city?.name || "Unknown",
          zones: Array.isArray(s.zone) ? s.zone.map((z) => ({ id: z._id.$oid || z._id, title: z.title || "Unknown" })) : [],
        }));
        setStores(mappedStores);
        console.log("Mapped stores:", mappedStores);
      } else {
        setError((prev) => prev + (prev ? ", " : "") + "Failed to load stores: Invalid data format");
      }

      const zonesData = await zonesRes.json();
      console.log("Zones API response:", zonesData);
      if (Array.isArray(zonesData)) {
        const zoneList = zonesData.reduce((acc, city) => {
          if (city?.zones && Array.isArray(city.zones)) {
            return [
              ...acc,
              ...city.zones.map((zone) => ({
                id: zone._id.$oid || zone._id,
                title: zone.zoneTitle || "Unknown",
                city: city.city || "Unknown",
              })),
            ];
          }
          return acc;
        }, []);
        setZones(zoneList);
      } else {
        setError((prev) => prev + (prev ? ", " : "") + "Failed to load zones");
      }

      const driversData = await driversRes.json();
      console.log("Drivers API response:", driversData);
      if (driversData.Driver && Array.isArray(driversData.Driver)) {
        const mappedDrivers = driversData.Driver.map((d) => ({
          id: d._id,
          name: d.driverName || "Unknown",
        }));
        setDrivers(mappedDrivers);
        console.log("Mapped drivers:", mappedDrivers);
      } else {
        console.error("Invalid drivers data format:", driversData);
        setError((prev) => prev + (prev ? ", " : "") + "Failed to load drivers: Invalid data format");
      }

      const variantPromises = ordersData.orders?.flatMap((order) =>
        order.items.map((item) =>
          fetch(`https://fivlia.onrender.com/variants?productId=${item.productId.$oid || item.productId}`)
            .then((res) => res.json())
            .then((data) => ({ productId: item.productId.$oid || item.productId, variants: data.variants || [] }))
            .catch((err) => {
              console.error(`Error fetching variants for product ${item.productId.$oid || item.productId}:`, err);
              return { productId: item.productId.$oid || item.productId, variants: [] };
            })
        )
      ) || [];
      const variantResults = await Promise.all(variantPromises);
      const variantMap = variantResults.reduce((acc, { productId, variants }) => ({
        ...acc,
        [productId]: variants,
      }), {});
      setVariants(variantMap);
      console.log("Variants map:", variantMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
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
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`https://fivlia.onrender.com/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus } : order))
        );
        setSelectedOrder((prev) => (prev?._id === orderId ? { ...prev, orderStatus: newStatus } : prev));
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("Error updating status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDriverAssign = async (orderId, driverId) => {
    setDriverUpdating(true);
    try {
      const res = await fetch(`https://fivlia.onrender.com/orders/${orderId}/assignDriver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, driverId } : order))
        );
        setSelectedOrder((prev) => (prev?._id === orderId ? { ...prev, driverId } : prev));
      } else {
        setError("Failed to assign driver");
      }
    } catch (err) {
      setError("Error assigning driver");
    } finally {
      setDriverUpdating(false);
    }
  };

  const handleInvoiceDownload = async (orderId) => {
    try {
      const response = await fetch("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      setError("Failed to download invoice");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (order._id && order._id.toLowerCase().includes(search)) ||
      (order.items?.[0]?.name && order.items[0].name.toLowerCase().includes(search)) ||
      (order.addressId?.fullAddress || "").toLowerCase().includes(search) ||
      (order.orderStatus && order.orderStatus.toLowerCase().includes(search)) ||
      (order.storeId?.storeName || "").toLowerCase().includes(search);

    const matchesStore = !selectedStore || String(order.storeId?._id) === String(selectedStore);
    const matchesZone =
      !selectedZone ||
      zones.some((zone) => zone.id === selectedZone && zone.city === order.city);
    const matchesStatus = !selectedStatus || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStore && matchesZone && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + entriesToShow);

  const csvData = filteredOrders.map((order, index) => ({
    No: startIndex + index + 1,
    OrderID: order._id,
    Item: order.items?.[0]?.name || "-",
    Address: order.addressId?.fullAddress || "-",
    Driver: drivers.find((d) => d.id === String(order.driverId))?.name || "-",
    Store: order.storeId?.storeName || "-",
    PaymentStatus: order.cashOnDelivery ? "Cash" : "Online",
    Status: order.orderStatus || "-",
  }));

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap');
          .order-container {
            font-family: 'Urbanist', sans-serif;
            padding: 16px;
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
          }
          .order-id {
            background: #007bff;
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            display: inline-block;
            font-size: 12px;
            max-width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: transform 0.2s, background 0.2s;
            cursor: pointer;
          }
          .order-id:hover {
            background: #0056b3;
            transform: scale(1.05);
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
          .view-button, .download-button {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
          }
          .view-button:hover, .download-button:hover {
            background: #0056b3;
          }
          .status-select, .driver-select {
            padding: 6px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            font-size: 12px;
            width: 120px;
          }
          .payment-cash {
            color: #007bff;
            font-weight: 600;
          }
          .payment-online {
            color: #28a745;
            font-weight: 600;
          }
          .transaction-id {
            display: block;
            font-size: 10px;
            color: #7b809a;
          }
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
          }
          .pagination button:disabled {
            background: #e0e0e0;
            cursor: not-allowed;
          }
          .modal-content {
            background: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 800px;
            margin: 40px auto;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            overflow-x: auto;
          }
          .address-modal-content {
            background: white;
            padding: 24px;
            border-radius: 16px;
            max-width: 500px;
            margin: 40px auto;
            position: relative;
            box-shadow: 0 6px 24px rgba(0,0,0,0.15);
            overflow: hidden;
            font-family: 'Urbanist', sans-serif;
          }
          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            color: #344767;
            font-size: 18px;
            transition: color 0.2s;
          }
          .modal-close:hover {
            color: #007bff;
          }
          .modal-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .modal-table th, .modal-table td {
            padding: 8px;
            border: 1px solid #e0e0e0;
            font-size: 12px;
            text-align: left;
          }
          .modal-table th {
            background: #007bff;
            color: white;
            font-weight: 600;
          }
          .modal-table td img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            vertical-align: middle;
            margin-right: 8px;
          }
          .modal-table tfoot td {
            font-weight: 600;
            background: #f8f9fa;
          }
          .address-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            border: 1px solid #e0e0e0;
          }
          .address-field {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: #344767;
          }
          .address-field-icon {
            color: #007bff;
            font-size: 18px;
          }
          .address-field-label {
            font-weight: 600;
            width: 100px;
            flex-shrink: 0;
          }
          .address-field-value {
            flex: 1;
            word-break: break-word;
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
          @keyframes bg {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .controls-container {
              flex-direction: column;
            }
            .control-item {
              width: 98%;
            }
            .modal-content, .address-modal-content {
              margin: 20px;
              max-width: 90%;
            }
            .orders-table, .modal-table {
              font-size: 12px;
            }
            .header-cell, .body-cell, .modal-table th, .modal-table td {
              padding: 8px;
            }
            .status-select, .driver-select {
              width: 100px;
              font-size: 10px;
            }
            .address-field {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            .address-field-label {
              width: auto;
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
        }}
      >
        <div className="order-container">
          <div className="order-box">
            <div className="header">
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#344767" }}>Orders Management</h2>
                <p style={{ fontSize: "14px", color: "#7b809a" }}>View and manage all orders</p>
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
                <label>Store</label>
                <select value={selectedStore} onChange={(e) => { setSelectedStore(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Stores</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div className="control-item">
                <label>Zone</label>
                <select value={selectedZone} onChange={(e) => { setSelectedZone(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Zones</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.title}</option>
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
                  <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #007bff", borderRadius: "50%", width: "24px", height: "24px", animation: "bg 1s linear infinite" }}></div>
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
                      Order Details {sortConfig.key === "items[0].name" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell" onClick={() => handleSort("addressId.fullAddress")}>
                      Address {sortConfig.key === "addressId.fullAddress" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell">
                      Driver
                    </th>
                    <th className="header-cell" onClick={() => handleSort("storeId.storeName")}>
                      Store {sortConfig.key === "storeId.storeName" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th className="header-cell">
                      Invoice
                    </th>
                    <th className="header-cell">
                      Payment Status
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
                      const store = stores.find((s) => s.id === (order.storeId?._id?.$oid || order.storeId?._id));
                      const variant = variants[order.items?.[0]?.productId?.$oid || item?.productId]?.find(
                        (v) => (v._id?.$oid || v._id) === (order.items?.[0]?.varientId?.$oid || order.items?.[0]?.varientId)
                      );
                      return (
                        <tr key={order._id}>
                          <td className="body-cell">{startIndex + index + 1}</td>
                          <td className="body-cell">
                            <span
                              className="order-id"
                              title={order._id}
                            >
                              {order._id}
                            </span>
                          </td>
                          <td className="body-cell">
                            <span
                              className="item-link"
                              onClick={() => setSelectedOrder(order)}
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
                            <span
                              className="item-link"
                              onClick={() => setSelectedAddress(order.addressId)}
                              title={order.addressId?.fullAddress}
                            >
                              {order.addressId?.fullAddress ? (
                                order.addressId.fullAddress.length > 20
                                  ? `${order.addressId.fullAddress.substring(0, 20)}...`
                                  : order.addressId.fullAddress
                              ) : "-"}
                            </span>
                          </td>
                          <td className="body-cell">
                            <select
                              className="driver-select"
                              value={order.driverId || ""}
                              onChange={(e) => handleDriverAssign(order._id, e.target.value)}
                              disabled={driverUpdating || !drivers.length}
                            >
                              <option value="">Unassigned</option>
                              {drivers.map((driver) => (
                                <option key={driver.id} value={driver.id}>{driver.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="body-cell">
                            {order.storeId?.storeName ? `${order.storeId.storeName} (${store?.zone?.map((z) => z.title).join(", ") || "Unknown"})` : "-"}
                          </td>
                          <td className="body-cell">
                            <button
                              className="download-button"
                              onClick={() => handleInvoiceDownload(order._id)}
                            >
                              Download
                            </button>
                          </td>
                          <td className="body-cell">
                            <span className={`payment-${order.cashOnDelivery ? "cash" : "online"}`}>
                              {order.cashOnDelivery ? "Cash" : "Online"}
                            </span>
                            {!order.cashOnDelivery && order.transactionId && (
                              <span className="transaction-id">{order.transactionId}</span>
                            )}
                          </td>
                          <td className="body-cell">
                            <select
                              className="status-select"
                              value={order.orderStatus || "Pending"}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              disabled={statusUpdating}
                            >
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
                      <td colSpan="9" className="body-cell" style={{ textAlign: "center", color: "#7b809a" }}>
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
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Fullname</th>
                      <th>Quantity</th>
                      <th>Product</th>
                      <th>VariantName</th>
                      <th>Variant Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => {
                      const variant = variants[item.productId?.$oid || item.productId]?.find(
                        (v) => (v._id?.$oid || v._id) === (item.varientId?.$oid || item.varientId)
                      );
                      return (
                        <tr key={item._id?.$oid || item._id}>
                          <td>{index + 1}</td>
                          <td>{selectedOrder.addressId?.fullName || "-"}</td>
                          <td>{item.quantity || 0}</td>
                          <td>
                            <img src={item.image || "https://via.placeholder.com/40"} alt={item.name} />
                            <span
                              className="item-link"
                              title={item.name}
                            >
                              {item.name || "-"}
                            </span>
                          </td>
                          <td>{variant ? `${variant.variantName}: ${variant.value}` : "-"}</td>
                          <td>₹{variant?.price || item.price || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" style={{ textAlign: "right" }}>Total Amount:</td>
                      <td>₹{selectedOrder.totalPrice || 0}</td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>
        </Modal>

        <Modal open={!!selectedAddress} onClose={() => setSelectedAddress(null)}>
          <div className="address-modal-content">
            <span className="modal-close" onClick={() => setSelectedAddress(null)}>×</span>
            {selectedAddress && (
              <>
                <h3 style={{ fontWeight: 700, fontSize: "20px", color: "#344767", marginBottom: "16px" }}>
                  Address Details
                </h3>
                <div className="address-card">
                  <div className="address-field">
                    <FaUser className="address-field-icon" />
                    <span className="address-field-label">Full Name</span>
                    <span className="address-field-value">{selectedAddress.fullName || "-"}</span>
                  </div>
                  <div className="address-field">
                    <FaMapMarkerAlt className="address-field-icon" />
                    <span className="address-field-label">Address</span>
                    <span className="address-field-value">{selectedAddress.fullAddress || "-"}</span>
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

export default Orders;