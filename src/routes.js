/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Table from "layouts/servicearea/ServiceTable";
import Demo from "layouts/dashboard/Demo";
import Icon from "@mui/material/Icon";
import CityTable from "layouts/City Management/CityTable";
import UserData from "layouts/Users/Users";
import BanerManagement from "layouts/Banner/Banner";
import Categories from "layouts/Categories/Categories";
import BrandTable from "layouts/Brand/BrandTable";
import AttributeTable from "layouts/Attribute/AttributeArray";
import Tax from "layouts/Attribute/Tax";
import Product from "layouts/Products/Product";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Demo />,
  },
  {
    type: "collapse",
    name: "City Management",
    key: "city-management",
    icon: <Icon fontSize="small">location_city</Icon>, // Updated icon for clarity
    route: "/citytable",
    component: <CityTable />,
  },
  {
    type: "collapse",
    name: "Zone Management",
    key: "zone-management",
    icon: <Icon fontSize="small">location_on</Icon>,
    route: "/serviceArea",
    component: <Table />,
  },
  {
    type: "collapse",
    name: "Categories",
    key: "servicearea",
    icon: <Icon fontSize="small">storefront</Icon>,
    route: "/categories",
    component: <Categories />,
  },
  {
    type: "collapse",
    name: "Banner-Management",
    key: "banner",
    icon: <Icon fontSize="small">add_photo_alternate</Icon>,
    route: "/banner-manage",
    component: <BanerManagement />,
  },
  {
    type: "collapse",
    name: "Brands",
    key: "brands",
    icon: <Icon fontSize="small">diamond_shine</Icon>,
    route: "/brands-table",
    component: <BrandTable />,
  },
  {
    type: "collapse",
    name: "Attributes",
    key: "Attributes",
    icon: <Icon fontSize="small">format_list_bulleted</Icon>,
    collapse: [
       {
        name: "Item-Attributes",
        key: "Item-Attributes",
        route: "/attribute-table",
        component: <AttributeTable />,
        icon: <Icon fontSize="small">view_array</Icon>,
      },
      {
        name: "Tax",
        key: "attribute-tax",
        route: "/attribute-tax",
        component: <Tax />,
        icon: <Icon fontSize="small">account_balance</Icon>, 
      },
    ],
  },
  {
    type:"collapse",
    name:"Products",
    key:"product",
    icon:<Icon fontSize="small">storefront</Icon>,
    route:"/products",
    component:<Product />
  },
  {
    type: "collapse",
    name: "UserData",
    key: "userdata",
    icon: <Icon fontSize="small">diversity_3</Icon>,
    route: "/user-data",
    component: <UserData />,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;