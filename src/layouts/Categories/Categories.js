import def from "ajv/dist/vocabularies/applicator/additionalItems";
import React from "react";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";


function Categories(){
      const [controller] = useMaterialUIController();
      const { miniSidenav } = controller;
    
    return(
        <MDBox ml={miniSidenav ? "80px" : "250px"} p={2}>
        <h1>Hello</h1>
        </MDBox>
    );
}

export default Categories