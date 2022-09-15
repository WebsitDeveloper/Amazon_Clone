import React from "react";

const Right = ({ item }) => {
  const [price, setPrice] = React.useState(0);
  React.useEffect(() => {
    totalAmount();
  }, [item]);
  const totalAmount = () => {
    let price = 0;
    item.map((product) => {
      price += product.price.cost;
    });
    setPrice(price);
  };

  return (
    <div className="right_buy">
      <img
        src="https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png"
        alt=""
      />
      <div className="cost_right">
        <p>Your order is eligible for FREE Delivery. </p>
        <span style={{ color: "#565959" }}>
          Select this option at checkout. Details
        </span>
        <h3>
          Subtotal ({item.length} items):
          <span style={{ fontWeight: "700" }}> ${price}.00</span>
        </h3>
        <button className="rightbuy_btn">Proceed to Buy</button>
        <div className="emi">Emi available</div>
      </div>
    </div>
  );
};

export default Right;
