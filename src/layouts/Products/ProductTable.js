import React, { useState } from "react";
import MDBox from "components/MDBox";
import { Button, Menu, MenuItem, IconButton,Switch } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";


const headerCell = {
  padding: "14px 12px",
  border: "1px solid #ddd",
  fontSize: 18,
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  textAlign: "left",
};

const bodyCell = {
  padding: "12px",
  border: "1px solid #eee",
  fontSize: 16,
  backgroundColor: "#fff",
};

const dummyProducts = [
  {
    id: 1,
    name: "Aashirvaad Atta",
    image: "https://m.media-amazon.com/images/I/71JxxP1eDLL._SX522_.jpg",
    sku: "SKU001",
    ribbon: "Bestseller",
    city: "Hisar",
    zone: "Zone A",
    price: "₹220",
    category: "Grocery",
    stock: 90,
  },
  {
    id: 2,
    name: "India Gate Basmati Rice",
    image: "https://m.media-amazon.com/images/I/71HMyqG6MRL._SX522_.jpg",
    sku: "SKU002",
    ribbon: "Top Rated",
    city: "Delhi",
    zone: "Zone B",
    price: "₹560",
    category: "Grains",
    stock: 75,
  },
  {
    id: 3,
    name: "Tata Salt",
    image: "https://m.media-amazon.com/images/I/81cCFmEB4hL._SX522_.jpg",
    sku: "SKU003",
    ribbon: "Popular",
    city: "Mumbai",
    zone: "Zone C",
    price: "₹28",
    category: "Spices",
    stock: 120,
  },
  {
    id: 4,
    name: "Fortune Sunflower Oil",
    image: "https://m.media-amazon.com/images/I/61nOM+e+oQL._SX679_.jpg",
    sku: "SKU004",
    ribbon: "Healthy",
    city: "Hisar",
    zone: "Zone A",
    price: "₹130",
    category: "Oils",
    stock: 200,
  },
  {
    id: 5,
    name: "Nestle Everyday Dairy Whitener",
    image: "https://m.media-amazon.com/images/I/71mGugyqGjL._SX522_.jpg",
    sku: "SKU005",
    ribbon: "Hot Deal",
    city: "Delhi",
    zone: "Zone B",
    price: "₹370",
    category: "Dairy",
    stock: 45,
  },
  {
    id: 6,
    name: "Maggi 2-Minute Noodles",
    image: "https://m.media-amazon.com/images/I/61r4G-4xAmL._SX522_.jpg",
    sku: "SKU006",
    ribbon: "Snack Time",
    city: "Mumbai",
    zone: "Zone C",
    price: "₹12",
    category: "Snacks",
    stock: 300,
  },
  {
    id: 7,
    name: "Red Label Tea",
    image: "https://m.media-amazon.com/images/I/61mHq8FbTFL._SX522_.jpg",
    sku: "SKU007",
    ribbon: "Chai Lover",
    city: "Hisar",
    zone: "Zone A",
    price: "₹280",
    category: "Beverages",
    stock: 85,
  },
  {
    id: 8,
    name: "Surf Excel Matic Detergent",
    image: "https://m.media-amazon.com/images/I/51Wlr-LTxpL._SX522_.jpg",
    sku: "SKU008",
    ribbon: "Clean & Fresh",
    city: "Delhi",
    zone: "Zone B",
    price: "₹350",
    category: "Cleaning",
    stock: 65,
  },
  {
    id: 9,
    name: "Parle-G Biscuits",
    image: "https://m.media-amazon.com/images/I/71obqDbJv0L._SX522_.jpg",
    sku: "SKU009",
    ribbon: "Classic",
    city: "Mumbai",
    zone: "Zone C",
    price: "₹5",
    category: "Snacks",
    stock: 500,
  },
  {
    id: 10,
    name: "Harpic Toilet Cleaner",
    image: "https://m.media-amazon.com/images/I/71mdFXfUgmL._SX522_.jpg",
    sku: "SKU010",
    ribbon: "Power Clean",
    city: "Delhi",
    zone: "Zone B",
    price: "₹98",
    category: "Cleaning",
    stock: 110,
  },
];

function ProductTable() {
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [selectedCity, setSelectedCity] = useState("");

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const filteredProducts = dummyProducts
    .filter((item) =>
      selectedCity ? item.city === selectedCity : true
    )
    .filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    )
    .slice(0, entries);

  const cities = [...new Set(dummyProducts.map((p) => p.city))];

    const [publicStatus, setPublicStatus] = useState(
    dummyProducts.reduce((acc, cur) => {
      acc[cur.id] = true; // Default all to true
      return acc;
    }, {})
  );
    const handleSwitchChange = (id) => {
    setPublicStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <MDBox
      p={2}
      style={{
        marginLeft: miniSidenav ? "80px" : "250px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <div style={{ borderRadius: 15, padding: 20, overflowX: "auto" }}>
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
            <span style={{ fontWeight: "bold", fontSize: 26 }}>
              Product List
            </span>
            <br />
            <span style={{ fontSize: 17 }}>
              View and manage all products
            </span>
          </div>
          <Button
            style={{
              backgroundColor: "#00c853",
              height: 45,
              width: 160,
              fontSize: 13,
              color: "white",
              letterSpacing: "1px",
            }}
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </Button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={{ fontSize: 16 }}>Show Entries:</span>&nbsp;
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 30 }}>
            <div>
              <label style={{ fontSize: 16 }}>Filter by City:</label>&nbsp;
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ fontSize: 16, borderRadius: "6px" }}
              >
                <option value="">All</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 16 }}>Search:</label><br />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  padding: "10px",
                  borderRadius: "20px",
                  height: "40px",
                  width: "200px",
                  border: "1px solid #ccc",
                  fontSize: 16,
                  marginTop: 5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr>
                <th style={headerCell}>Sr. No</th>
                <th style={{ ...headerCell, minWidth: 250 }}>Product</th>
                <th style={headerCell}>SKU</th>
                {/* <th style={headerCell}>Ribbon</th> */}
                <th style={headerCell}>City</th>
                <th style={headerCell}>Zone</th>
                <th style={headerCell}>Price</th>
                <th style={headerCell}>Category</th>
                 <th style={headerCell}>Public</th>
                <th style={headerCell}>Stock</th>
                <th style={headerCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => (
                <tr key={item.id}>
                  <td style={bodyCell}>{index + 1}</td>
                  <td style={{ ...bodyCell, display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                    <span style={{ fontWeight: "500" }}>{item.name}</span>
                  </td>
                  <td style={bodyCell}>{item.sku}</td>
                  {/* <td style={bodyCell}>{item.ribbon}</td> */}
                  <td style={bodyCell}>{item.city}</td>
                  <td style={bodyCell}>{item.zone}</td>
                  <td style={bodyCell}>{item.price}</td>
                  <td style={bodyCell}>{item.category}</td>
                   <td style={bodyCell}>
                    <Switch
                      checked={publicStatus[item.id]}
                      onChange={() => handleSwitchChange(item.id)}
                      color="primary"
                    />
                  </td>
                  <td style={bodyCell}>{item.stock}</td>
                  <td style={bodyCell}>
                    <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuIndex === index}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                      <MenuItem onClick={handleMenuClose}>View Product</MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MDBox>
  );
}

export default ProductTable;
