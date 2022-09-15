import React, { useEffect, useState } from "react";
import "./navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/ContextProvider";
import Rightheader from "./Rightheader";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { account, setAccount } = React.useContext(LoginContext);
  // console.log(account);

  const history = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // filter product
  const [text, setText] = React.useState("");
  console.log(text);
  const [listOpen, setListopen] = React.useState(true);

  const { products } = useSelector((state) => state.getproductsdata);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const getDetailValidUser = async () => {
    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      /* jese add to cart kare gy to hame frontend se backend per cookie ko send 
      kare gy wo hamare backend me jai gi phr secret key ke sath verify kare gi
      is liye credentials use krte  */
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);

    if (res.status !== 201) {
      console.log("error");
    } else {
      console.log("data valid");
      setAccount(data);
    }
  };

  const handleOPen = () => {
    setDrawerOpen(true);
  };

  const handleDrwerClose = () => {
    setDrawerOpen(false);
  };

  const logoutUser = async () => {
    const res2 = await fetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      /* jese add to cart kare gy to hame frontend se backend per cookie ko send 
      kare gy wo hamare backend me jai gi phr secret key ke sath verify kare gi
      is liye credentials use krte  */
      credentials: "include",
    });
    const data2 = await res2.json();
    console.log(data2);

    if (res2.status !== 201) {
      console.log("error");
    } else {
      console.log("data valid");
      // alert("User Logout");
      toast.success("User Logout Successfully", {
        position: "top-center",
      });
      setAccount(false);
      history("/");
    }
  };

  const getText = (items) => {
    setText(items);
    setListopen(false);
  };

  useEffect(() => {
    getDetailValidUser();
  }, []);

  return (
    <header>
      <nav>
        <div className="left">
          <IconButton className="hamburgur" onClick={handleOPen}>
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>

          <Drawer open={drawerOpen} onClose={handleDrwerClose}>
            <Rightheader Logclose={handleDrwerClose} Logoutuser={logoutUser} />
          </Drawer>

          <div className="navlogo">
            <NavLink to="/">
              <img src="./amazon_PNG25.png" alt="" />
            </NavLink>
          </div>
          <div className="nav_searchbaar">
            <input
              type="text"
              name=""
              onChange={(e) => getText(e.target.value)}
              placeholder="Search your products..."
              id=""
            />
            <div className="search_icon">
              <SearchIcon id="search" />
            </div>
            {/* Search filter*/}
            {text && (
              <List className="extrasearch" hidden={listOpen}>
                {products
                  .filter((product) =>
                    product.title.longTitle
                      .toLowerCase()
                      .includes(text.toLowerCase())
                  )
                  .map((product) => (
                    <ListItem>
                      <NavLink
                        to={`/getproductsone/${product.id}`}
                        onClick={() => setListopen(true)}
                      >
                        {product.title.longTitle}
                      </NavLink>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>
        <div className="right">
          <div className="nav_btn">
            <NavLink to="/login"> signin </NavLink>
          </div>
          <div className="cart_btn">
            {
              /* if user login then click on cart they on buynow page and if user 
            not login then move to login page*/
              account ? (
                <NavLink to="/buynow">
                  <Badge badgeContent={account.carts.length} color="primary">
                    <ShoppingCartIcon id="icon" />
                  </Badge>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <Badge badgeContent={0} color="primary">
                    <ShoppingCartIcon id="icon" />
                  </Badge>
                </NavLink>
              )
            }
            <ToastContainer />

            <p>Cart</p>
          </div>
          {
            /*agar account me koi value ho gi to uska 1st character mile ga*/
            account ? (
              <Avatar
                className="avtar2"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {account.fname[0].toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                className="avtar"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              ></Avatar>
            )
          }
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>My account</MenuItem>
            {account ? (
              <MenuItem onClick={(handleClose, logoutUser)}>
                <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} />
                Logout
              </MenuItem>
            ) : (
              ""
            )}
          </Menu>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
