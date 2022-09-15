import React from "react";
import "./signin_up.css";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../context/ContextProvider";

const SignIn = () => {
  const [loginData, setLogindata] = React.useState({
    email: "",
    password: "",
  });
  console.log(loginData);

  const { account, setAccount } = React.useContext(LoginContext);

  const addData = (e) => {
    const { name, value } = e.target;

    setLogindata(() => {
      return {
        ...loginData,
        [name]: value,
      };
    });
  };

  const sendData = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    // fetch data
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    // console.log(data);

    if (res.status === 400 || !data) {
      // console.log("Invalid Data");
      toast.warn("Invalid Details", {
        position: "top-center",
      });
    } else {
      console.log("Data Is Valide");
      setAccount(data);
      toast.success("User Login Successfully", {
        position: "top-center",
      });
      setLogindata({ ...loginData, email: "", password: "" });
    }
  };

  return (
    <>
      <section>
        <div className="sign_container">
          <div className="sign_header">
            <img src="./blacklogoamazon.png" alt="amazonlogo" />
          </div>
          <div className="sign_form">
            <form method="POST">
              <h1>Sign-In</h1>
              <div className="form_data">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  onChange={addData}
                  value={loginData.email}
                  id="email"
                />
              </div>
              <div className="form_data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  onChange={addData}
                  value={loginData.password}
                  placeholder="At least 6 char"
                  name="password"
                  id="password"
                />
              </div>
              <button className="signin_btn" onClick={sendData}>
                {" "}
                Continue{" "}
              </button>
            </form>
          </div>
          <div className="create_accountinfo">
            <p>New To Amazon</p>
            <NavLink to="/register">
              <button>Create Your Amazon Account</button>
            </NavLink>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default SignIn;
