import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { Button, Chip, Typography, Popover, TextField } from "@mui/material";
import { useMaterialUIController } from "context";

// Styles for table headers, cells, and popovers
const headerCell = {
  padding: "14px 12px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const bodyCell = {
  padding: "12px",
  border: "1px solid #eee",
  fontSize: "0.9rem",
  backgroundColor: "#fff",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const styles = `
  .responsive-table-container {
    overflow-x: auto;
    width: 100%;
  }
  .responsive-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .responsive-table th, .responsive-table td {
    min-width: 80px;
  }
  .filter-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 15px;
  }
  .filter-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .filter-item select, .filter-item input {
    font-size: 0.9rem;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  .stock-box {
    background-color: #f5f5f5;
    border: 1px solid #007bff;
    border-radius: 6px;
    padding: 10px 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .stock-box:hover {
    background-color: #e0e0e0;
  }
  .stock-box-label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #333;
  }
  .stock-box-value {
    font-size: 1rem;
    color: #d32f2f;
  }
  .popover-container {
    padding: 15px;
    max-width: 400px;
    max-height: 400px;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  .popover-product {
    margin-bottom: 15px;
  }
  .popover-product-name {
    font-size: 0.9rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  .popover-variant {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }
  .popover-variant-label {
    font-size: 0.8rem;
    color: #555;
    flex: 1;
  }
  .popover-variant-input {
    width: 60px;
    padding: 5px;
    font-size: 0.8rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  .popover-save-button {
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  .edit-stock-button {
    background-color: #388e3c;
    color: white;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .card-container {
    display: none;
    flex-direction: column;
    gap: 15px;
  }
  .product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .product-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .product-card-content {
    display: grid;
    gap: 8px;
  }
  .product-card-label {
    font-weight: bold;
    font-size: 0.85rem;
    color: #333;
  }
  .product-card-value {
    font-size: 0.85rem;
    color: #555;
  }

  @media (max-width: 900px) {
    .responsive-table th, .responsive-table td {
      font-size: 0.8rem;
      padding: 8px;
    }
    .filter-item select, .filter-item input {
      font-size: 0.8rem;
      padding: 6px;
    }
  }

  @media (max-width: 600px) {
    .responsive-table-container {
      display: none;
    }
    .card-container {
      display: flex;
    }
    .filter-container {
      flex-direction: column;
      align-items: flex-start;
    }
    .filter-item {
      width: 100%;
    }
    .filter-item input {
      width: 100%;
      box-sizing: border-box;
    }
    .filter-item select {
      width: 100%;
    }
    .stock-box {
      width: 100%;
      text-align: center;
    }
    .popover-container {
      max-width: 300px;
    }
  }
`;

function StockManagement() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverType, setPopoverType] = useState("");
  const [popoverProductId, setPopoverProductId] = useState(null);
  const [stockUpdates, setStockUpdates] = useState({});

  useEffect(() => {
    const id = localStorage.getItem("storeId");
    console.log("Store ID:", id);
    setStoreId(id);
  }, []);

  useEffect(() => {
    const getStoreDetails = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const response = await fetch(`https://fivlia.onrender.com/getStore?id=${storeId}`);
        if (response.status === 200) {
          const result = await response.json();
          const { products } = result;
          console.log("API Response:", result);

          const transformedProducts = products.map((product) => {
            const totalStock = product.inventory?.reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
            return {
              ...product,
              inventory: product.inventory || [],
              variants: product.variants || [],
              productThumbnailUrl: product.productImageUrl?.[0] || "",
              totalStock,
            };
          });

          setProducts(transformedProducts);
          setData(transformedProducts);

          // Calculate out of stock and low stock counts
          const outCount = transformedProducts.filter((p) => p.totalStock === 0).length;
          const lowCount = transformedProducts.filter((p) => p.totalStock > 0 && p.totalStock <= 10).length;
          setOutOfStockCount(outCount);
          setLowStockCount(lowCount);

          console.log("Transformed Products:", transformedProducts);
        } else {
          console.error("API Error: Status", response.status);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getStoreDetails();
  }, [storeId]);

  const filteredProducts = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item).some((val) =>
          Array.isArray(val)
            ? val.some((v) =>
                typeof v === "object"
                  ? Object.values(v).some((subVal) =>
                      String(subVal).toLowerCase().includes(search.toLowerCase())
                    )
                  : String(v).toLowerCase().includes(search.toLowerCase())
              )
            : String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + entries);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePopoverOpen = (event, type, productId = null) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverType(type);
    setPopoverProductId(productId);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setPopoverType("");
    setPopoverProductId(null);
    setStockUpdates({});
  };

  const handleStockChange = (productId, inventoryId, value) => {
    setStockUpdates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [inventoryId]: Number(value) || 0,
      },
    }));
  };

  const handleSaveStock = async () => {
    let updatedProducts = [...products];

    // Process each product with stock updates
    for (const productId of Object.keys(stockUpdates)) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      // Prepare API payload
      const stockPayload = product.inventory
        .filter((inv) => stockUpdates[productId][inv._id] !== undefined)
        .map((inv) => ({
          variantId: inv.variantId,
          quantity: stockUpdates[productId][inv._id],
        }));

      if (stockPayload.length === 0) continue;

      try {
        const response = await fetch(`https://fivlia.onrender.com/updateStock/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            stock: stockPayload,
          }),
        });

        if (response.status === 200 || response.status === 201) {
          const result = await response.json();
          console.log("Stock Update Response:", result);

          // Update local state with API response
          updatedProducts = updatedProducts.map((p) => {
            if (p._id === productId) {
              const updatedInventory = p.inventory.map((inv) => {
                const updatedStock = result.stock.stock.find(
                  (s) => s.varientId.toString() === inv.variantId.toString()
                );
                return updatedStock
                  ? { ...inv, quantity: updatedStock.quantity }
                  : inv;
              });
              const totalStock = updatedInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
              return { ...p, inventory: updatedInventory, totalStock };
            }
            return p;
          });
        } else {
          console.warn("API Error: Status", response.status);
          // Fallback to local update
          updatedProducts = updatedProducts.map((p) => {
            if (p._id === productId) {
              const updatedInventory = p.inventory.map((inv) => ({
                ...inv,
                quantity: stockUpdates[productId][inv._id] ?? inv.quantity,
              }));
              const totalStock = updatedInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
              return { ...p, inventory: updatedInventory, totalStock };
            }
            return p;
          });
        }
      } catch (err) {
        console.error("Stock Update Error:", err);
        // Fallback to local update
        updatedProducts = updatedProducts.map((p) => {
          if (p._id === productId) {
            const updatedInventory = p.inventory.map((inv) => ({
              ...inv,
              quantity: stockUpdates[productId][inv._id] ?? inv.quantity,
            }));
            const totalStock = updatedInventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
            return { ...p, inventory: updatedInventory, totalStock };
          }
          return p;
        });
      }
    }

    // Update state
    setProducts(updatedProducts);
    setData(updatedProducts);

    // Recalculate stock counts
    const outCount = updatedProducts.filter((p) => p.totalStock === 0).length;
    const lowCount = updatedProducts.filter((p) => p.totalStock > 0 && p.totalStock <= 10).length;
    setOutOfStockCount(outCount);
    setLowStockCount(lowCount);

    handlePopoverClose();
  };

  const popoverProducts = popoverType === "outOfStock"
    ? filteredProducts.filter((p) => p.totalStock === 0)
    : popoverType === "lowStock"
    ? filteredProducts.filter((p) => p.totalStock > 0 && p.totalStock <= 10)
    : popoverType === "editStock"
    ? filteredProducts.filter((p) => p._id === popoverProductId)
    : [];

  return (
    <>
      <style>{styles}</style>
      <MDBox
        p={2}
        style={{
          marginLeft: miniSidenav ? "80px" : "250px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div style={{ borderRadius: 15, padding: 20 }}>
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
              <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Stock Management</span>
              <br />
              <span style={{ fontSize: "1rem" }}>Monitor and manage product stock levels</span>
            </div>
          </div>

          <div className="filter-container">
            <div className="filter-item">
              <span style={{ fontSize: "0.9rem" }}>Show Entries:</span>
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={70}>70</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="filter-item">
              <div className="stock-box" onClick={(e) => handlePopoverOpen(e, "outOfStock")}>
                <span className="stock-box-label">Out of Stock:</span>{" "}
                <span className="stock-box-value">{outOfStockCount}</span>
              </div>
            </div>
            <div className="filter-item">
              <div className="stock-box" onClick={(e) => handlePopoverOpen(e, "lowStock")}>
                <span className="stock-box-label">Low Stock:</span>{" "}
                <span className="stock-box-value">{lowStockCount}</span>
              </div>
            </div>
            <div className="filter-item">
              <label style={{ fontSize: "0.9rem" }}>Search:</label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or SKU..."
                style={{
                  padding: "8px",
                  borderRadius: "20px",
                  height: "40px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <Popover
  open={Boolean(popoverAnchorEl)}
  anchorEl={popoverAnchorEl}
  onClose={handlePopoverClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "left",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "left",
  }}
  PaperProps={{
    style: { backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" },
  }}
>
  <div className="popover-container">
    <Typography variant="h6" style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
      {popoverType === "outOfStock" ? "Out of Stock Products" : 
       popoverType === "lowStock" ? "Low Stock Products" : 
       "Edit Stock"}
    </Typography>
    {popoverProducts.length > 0 ? (
      <>
        {popoverProducts.map((product) => (
          <div key={product._id} className="popover-product">
            <div className="popover-product-name">{product.productName}</div>
            {product.inventory.map((inv) => {
              const variant = product.variants.find(
                (v) => v._id?.toString() === inv.variantId?.toString()
              );
              return variant ? (
                <div key={inv._id} className="popover-variant">
                  <span className="popover-variant-label">
                    {variant.attributeName}: {variant.variantValue} (Current Stock: {inv?.quantity ?? 0})
                  </span>
                  <TextField
                    className="popover-variant-input"
                    type="number"
                    value={stockUpdates[product._id]?.[inv._id] ?? inv?.quantity ?? 0}
                    onChange={(e) => handleStockChange(product._id, inv._id, e.target.value)}
                    inputProps={{ 
                      min: 0,
                      style: { 
                        fontSize: "0.9rem", 
                        fontWeight: "bold", 
                        color: "#000", 
                        backgroundColor: "#f0f4f8", 
                        padding: "6px", 
                        borderRadius: "4px" 
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#007bff" },
                        "&:hover fieldset": { borderColor: "#005cbf" },
                        "&.Mui-focused fieldset": { borderColor: "#003087" },
                      },
                    }}
                  />
                </div>
              ) : null;
            })}
          </div>
        ))}
        <Button
          className="popover-save-button"
          onClick={handleSaveStock}
        >
          Save Stock
        </Button>
      </>
    ) : (
      <Typography style={{ fontSize: "0.8rem", color: "#555" }}>
        No products found.
      </Typography>
    )}
  </div>
</Popover>

          <div className="responsive-table-container">
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Typography>Loading Products...</Typography>
              </div>
            ) : (
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th style={{ ...headerCell, minWidth: "80px" }}>Sr. No</th>
                    <th style={{ ...headerCell, minWidth: "200px" }}>Product Name</th>
                    <th style={{ ...headerCell, minWidth: "100px" }}>SKU</th>
                    <th style={{ ...headerCell, minWidth: "200px" }}>Variants</th>
                    <th style={{ ...headerCell, minWidth: "100px" }}>Total Stock</th>
                    <th style={{ ...headerCell, minWidth: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((item, index) => {
                      const variantStocks = item.variants.map((variant) => {
                        const inv = item.inventory?.find(
                          (inv) => inv.variantId?.toString() === variant._id?.toString()
                        );
                        return {
                          label: `${variant.attributeName}: ${variant.variantValue} (${inv?.quantity || 0})`,
                          quantity: inv?.quantity || 0,
                        };
                      });

                      return (
                        <tr key={item._id}>
                          <td style={{ ...bodyCell, textAlign: "center" }}>{startIndex + index + 1}</td>
                          <td style={{ ...bodyCell, display: "flex", alignItems: "center", gap: 10 }}>
                            <img
                              src={item.productThumbnailUrl || "https://via.placeholder.com/60"}
                              alt={item.productName}
                              style={{
                                width: 60,
                                height: 70,
                                borderRadius: 6,
                                objectFit: "cover",
                              }}
                            />
                            <span style={{ fontWeight: "500" }}>{item.productName}</span>
                          </td>
                          <td style={{ ...bodyCell, textAlign: "center" }}>{item.sku || "N/A"}</td>
                          <td style={{ ...bodyCell }}>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {variantStocks.map((vs, idx) => (
                                <Chip
                                  key={idx}
                                  label={vs.label}
                                  size="small"
                                  style={{
                                    backgroundColor: vs.quantity === 0 ? "#ffebee" : vs.quantity <= 10 ? "#fff3e0" : "#e8f5e9",
                                    color: vs.quantity === 0 ? "#d32f2f" : vs.quantity <= 10 ? "#f57c00" : "#388e3c",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              ))}
                              {!variantStocks.length && <span>N/A</span>}
                            </div>
                          </td>
                          <td style={{ ...bodyCell, textAlign: "center", fontWeight: "bold" }}>
                            {item.totalStock}
                          </td>
                          <td style={{ ...bodyCell, textAlign: "center" }}>
                            <Button
                              className="edit-stock-button"
                              onClick={(e) => handlePopoverOpen(e, "editStock", item._id)}
                            >
                              Edit Stock
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ ...bodyCell, textAlign: "center" }}>
                        {data.length === 0 && !loading ? "No products found" : "Loading..."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="card-container">
            {loading ? (
              <Typography style={{ textAlign: "center", padding: "20px" }}>
                Loading products...
              </Typography>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((item, index) => {
                const variantStocks = item.variants.map((variant) => {
                  const inv = item.inventory?.find(
                    (inv) => inv.variantId?.toString() === variant._id?.toString()
                  );
                  return {
                    label: `${variant.attributeName}: ${variant.variantValue} (${inv?.quantity || 0})`,
                    quantity: inv?.quantity || 0,
                  };
                });

                return (
                  <div key={item._id} className="product-card">
                    <div className="product-card-header">
                      <img
                        src={item.productThumbnailUrl || "https://via.placeholder.com/60"}
                        alt={item.productName}
                        style={{
                          width: 50,
                          height: 60,
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />
                      <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{item.productName}</span>
                    </div>
                    <div className="product-card-content">
                      <div>
                        <span className="product-card-label">Sr. No:</span>
                        <span className="product-card-value">{startIndex + index + 1}</span>
                      </div>
                      <div>
                        <span className="product-card-label">SKU:</span>
                        <span className="product-card-value">{item.sku || "N/A"}</span>
                      </div>
                      <div>
                        <span className="product-card-label">Variants:</span>
                        <span className="product-card-value">
                          {variantStocks.length > 0 ? (
                            variantStocks.map((vs, idx) => (
                              <Chip
                                key={idx}
                                label={vs.label}
                                size="small"
                                style={{
                                  backgroundColor: vs.quantity === 0 ? "#ffebee" : vs.quantity <= 10 ? "#fff3e0" : "#e8f5e9",
                                  color: vs.quantity === 0 ? "#d32f2f" : vs.quantity <= 10 ? "#f57c00" : "#388e3c",
                                  fontSize: "0.7rem",
                                  marginRight: 5,
                                  marginBottom: 5,
                                }}
                              />
                            ))
                          ) : (
                            "N/A"
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="product-card-label">Total Stock:</span>
                        <span className="product-card-value" style={{ fontWeight: "bold" }}>
                          {item.totalStock}
                        </span>
                      </div>
                      <div>
                        <Button
                          className="edit-stock-button"
                          onClick={(e) => handlePopoverOpen(e, "editStock", item._id)}
                        >
                          Edit Stock
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <Typography style={{ textAlign: "center", padding: "20px" }}>
                {data.length === 0 && !loading ? "No products found" : "Loading..."}
              </Typography>
            )}
          </div>

          {!loading && paginatedProducts.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 5,
                  fontSize: "0.9rem",
                }}
              >
                Previous Page
              </Button>
              <span style={{ fontSize: "0.9rem" }}>
                Page {currentPage} of {totalPages} (Total: {totalItems} items)
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 5,
                  fontSize: "0.9rem",
                }}
              >
                Next Page
              </Button>
            </div>
          )}
        </div>
      </MDBox>
    </>
  );
}

export default StockManagement;