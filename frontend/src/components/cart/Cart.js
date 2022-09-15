import { Divider } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cart.css";
import { LoginContext } from "../context/ContextProvider";
import CircularProgress from "@mui/material/CircularProgress";

const Cart = () => {
  const { id } = useParams("");
  // console.log(id);

  const history = useNavigate("");

  /* account or setAccount ki value jo LoginContext me pass ki use idhr
  get krna
*/
  const { account, setAccount } = useContext(LoginContext);

  const [individualData, setIndividualdata] = React.useState("");

  console.log(individualData);

  const getindividualdata = async () => {
    const res = await fetch(`/getproductsone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    // console.log(data);

    if (res.status !== 201) {
      console.log("no data available");
    } else {
      console.log("getdata");
      setIndividualdata(data);
    }
  };

  React.useEffect(() => {
    setTimeout(getindividualdata, 1000);
  }, [id]);

  // add cart function
  const addToCart = async (id) => {
    const checkers = await fetch(`/addcart/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        individualData,
      }),
      /* jese add to cart kare gy to hame frontend se backend per cookie ko send 
      kare gy wo hamare backend me jai gi phr secret key ke sath verify kare gi
      is liye credentials use krte  */
      credentials: "include",
    });

    const data1 = await checkers.json();
    console.log(data1);

    // user invalid ho ga to ye hamre cart ke andar request root nai ho ga
    if (checkers.status === 400 || !data1) {
      console.log("User Invalid!!!");
      alert("User Invalid!!!");
    } else {
      // alert("Data Added In Your Cart");
      history("/buynow");
      setAccount(data1);
    }
  };

  return (
    <div className="cart_section">
      {individualData && Object.keys(individualData).length && (
        <div className="cart_container">
          <div className="left_cart">
            <img src={individualData.detailUrl} alt="cart_image" />
            <div className="cart_btn">
              <button
                className="cart_btn1"
                onClick={() => addToCart(individualData.id)}
              >
                Add to Cart
              </button>
              <button className="cart_btn2">Buy Now</button>
            </div>
          </div>
          <div className="right_cart">
            <h3>{individualData.title.shortTitle}</h3>
            <h4>{individualData.title.longTitle}</h4>
            <Divider />
            <p className="mrp">M.R.P : ${individualData.price.mrp}</p>
            <p>
              Deal of the Day :{" "}
              <span style={{ color: "#b12704" }}>
                ${individualData.price.cost}
              </span>
            </p>
            <p>
              You save :{" "}
              <span style={{ color: "#b12704" }}>
                ${individualData.price.mrp - individualData.price.cost} (
                {individualData.price.discount})
              </span>
            </p>

            <div className="discount_box">
              <h5>
                Discount :{" "}
                <span style={{ color: "#111" }}>{individualData.discount}</span>
              </h5>
              <h4>
                Free Delivery :
                <span style={{ color: "#111", fontWeight: 600 }}>
                  {" "}
                  Oct 8 - 22
                </span>{" "}
                Details
              </h4>
              <p>
                Fastest Delivery:{" "}
                <span style={{ color: "#111", fontWeight: 600 }}>
                  Tomorrow 11AM
                </span>{" "}
              </p>
              <p className="description">
                About the Item :{" "}
                <span
                  style={{
                    color: "#565959",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "0.4px",
                  }}
                >
                  {individualData.description}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      {!individualData ? (
        <div className="circle">
          <CircularProgress />
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
