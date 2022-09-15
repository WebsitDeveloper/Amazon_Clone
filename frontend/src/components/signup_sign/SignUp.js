import React from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [userData, setUserdata] = React.useState({
    fname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });
  console.log(userData);

  const addData = (e) => {
    const { name, value } = e.target;

    setUserdata(() => {
      return {
        ...userData,
        [name]: value,
      };
    });
  };

  const senddata = async (e) => {
    e.preventDefault();
    const { fname, email, mobile, password, cpassword } = userData;

    const res = await fetch("register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname,
        email,
        mobile,
        password,
        cpassword,
      }),
    });
    const data = await res.json();
    // console.log(data);

    //if data not set and no value in data
    if (res.status === 400 || !data) {
      // alert("No Data");
      toast.warn("Invalid Data", {
        position: "top-center",
      });
    } else {
      // alert("Successfully!!! Data Added");
      toast.success("Successfully!!! Data Added", {
        position: "top-center",
      });
      setUserdata({
        ...userData,
        fname: "",
        email: "",
        mobile: "",
        password: "",
        cpassword: "",
      });
    }
  };

  return (
    <section>
      <div className="sign_container">
        <div className="sign_header">
          <img src="./blacklogoamazon.png" alt="amazonlogo" />
        </div>
        <div className="sign_form">
          <form method="POST">
            <h1>Sign-Up</h1>
            <div className="form_data">
              <label htmlFor="fname">Your Name</label>
              <input
                type="text"
                onChange={addData}
                value={userData.fname}
                name="fname"
                id="fname"
              />
            </div>
            <div className="form_data">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                onChange={addData}
                value={userData.email}
                name="email"
                id="email"
              />
            </div>
            <div className="form_data">
              <label htmlFor="number">Mobile</label>
              <input
                type="text"
                onChange={addData}
                value={userData.mobile}
                name="mobile"
                id="mobile"
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                onChange={addData}
                value={userData.password}
                placeholder="At least 6 char"
                name="password"
                id="password"
              />
            </div>
            <div className="form_data">
              <label htmlFor="cpassword">Password Again</label>
              <input
                type="password"
                onChange={addData}
                value={userData.cpassword}
                name="cpassword"
                id="cpassword"
              />
            </div>
            <button className="signin_btn" onClick={senddata}>
              Continue
            </button>
            <div className="signin_info">
              <p>Already have an account?</p>
              <NavLink to="/login"> Sign In</NavLink>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default SignUp;
