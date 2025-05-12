import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import Switch from '@mui/material/Switch'; 
import { useNavigate } from 'react-router-dom';
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [count,setCount]=useState();
  const navigate=useNavigate();
    const [controller] = useMaterialUIController();
      const { miniSidenav } = controller;

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetch('https://node-m8jb.onrender.com/getCategories');
      if (result.status === 200) {
        const json = await result.json();
        setCategories(json.result);
      }
    };
    getCategories();
  }, []);


 const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
        if (!confirmDelete) return;

        try {
            const result = await fetch(`https://node-m8jb.onrender.com/delete/${id}`, {
                method: "DELETE",
            });

            if (result.status === 200) {
                alert("Categories deleted successfully");
                setCategories(categories.filter((item) => item._id !== id));
                
            } else {
                alert("Something went wrong");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const AddCate=()=>{
        navigate('/addCategories')
    }

  return (
     <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}
     sx={{marginTop:'40px'}}
     >
   
      <Typography variant="h6" gutterBottom style={{marginLeft:30,fontSize:30}}>
       Categories Lists
      </Typography>

        {/* Add Category Button */}
        <MDBox
          sx={{
            position: 'absolute',
            top: '60px',
            right: '80px',
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={AddCate}
            sx={{ fontSize: '14px', textTransform: 'none' ,borderRadius:5,color:'white !important'}}
          >
            Add Categories
          </Button>
        </MDBox>

      <MDBox
        position="relative"
        mt={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <MDBox
          sx={{
            background: '#1A73E8',
            color: 'white !important',
            padding: '20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '18px',
            width: '90%',
            maxWidth: '1000px',
            position: 'absolute',
            top: '-5',
            zIndex: 1,
            height: '70px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Categories Table
        </MDBox>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            mt: 5,
            width: '95%',
            maxWidth: '1000px',
            marginTop: 5,
            border: '1px solid #ddd',
          }}  
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa', height: 79 ,width:'168.5%'}}>
              <TableRow style={{backgroundColor:'',width:'150%',justifyContent:'space-between'}}>
                {['NAME', 'ITEMS', 'PUBLIC', 'ACTION'].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#6c757d',
                      verticalAlign: 'bottom',
                      width: heading === 'NAME' ? '47%' : heading === 'ITEMS' ? '10%' : heading === 'PUBLIC' ? '10%' : '10%',
                    }}
                  >
                    <h3 style={{marginTop:13,}}>{heading}</h3>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((item, index) => (
                <TableRow key={index}>
                  {/* NAME */}
                  <TableCell sx={{ width: '60%', border: '1px solid #ddd' }}>
                    <MDBox display="flex" alignItems="center">
                      <Avatar
                        src={`https://node-m8jb.onrender.com${item.file}`}
                        sx={{ width: 36, height: 36, mr: 1.5 }}
                      />
                      <Typography fontWeight={500} fontSize="14px">
                        {item.name}
                      </Typography>
                    </MDBox>
                  </TableCell>

                  {/* ITEMS */}
                  <TableCell sx={{ width: '10%', border: '1px solid #ddd' }}>
                    <Typography fontWeight={500} fontSize="14px">
                      {/* <Avatar
                        // src={`https://node-m8jb.onrender.com${item.file}`}
                        // sx={{ width: 36, height: 36, mr: 1.5 }}
                      /> */}
                      {item.subcat && Array.isArray(item.subcat) ? item.subcat.length : 0}
                    </Typography>
                  </TableCell>

                  {/* PUBLIC */}
                  <TableCell sx={{ width: '12%', border: '1px solid #ddd' }}>
                    <Switch
                      checked={item.publish}
                      onChange={() => handlePublishToggle(item._id, item.publish)}
                      color="primary"
                    />
                  </TableCell>

                  {/* ACTION */}
                  <TableCell sx={{ width: '100%', border: '1px solid #ddd',display:'flex'}}>
                    <Button size="big" sx={{ fontSize: '13px', textTransform: 'none',color:'green' }}>
                      Edit
                    </Button>
                    <Button size="small" sx={{ fontSize: '13px', textTransform: 'none',color:'red' }} onClick={() => handleDelete(item._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MDBox>
    </MDBox>
  );
};

export default Categories;
