const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// get productsdata api
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log("console the data" + productsdata);
    res.status(201).json(productsdata);
  } catch (error) {
    console.log("error" + error.message);
  }
});

// get individual data

router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const individualdata = await Products.findOne({ id: id });
    // console.log(individualdata + "individual data");
    res.status(201).json(individualdata);
  } catch (error) {
    res.status(400).json(individualdata);
    console.log("error" + error.message);
    8;
  }
});

// register data

router.post("/register", async (req, res) => {
  // console.log(req.body);

  const { fname, email, mobile, password, cpassword } = req.body;

  // if field is empty through error to user
  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(400).json({ error: "fill all fields!!!" });
    console.log("no data is available");
  }

  // to check data in database or not
  try {
    const preuser = await USER.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: "this user is already present" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password and cpassword not same" });
    } else {
      const finalUser = new USER({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      // bcryptjs

      // password hashing process
      const storeData = await finalUser.save();
      console.log(storeData);

      res.status(201).json(storeData);
    }
  } catch (error) {}
});

// login user API

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Fill The Data" });
  }

  // through an error if user is not register
  try {
    const userLogin = await USER.findOne({ email: email });
    console.log(userLogin + "user value");

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // console.log(isMatch);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Password" });
      } else {
        // token generate
        const token = await userLogin.generateAuthtoken();
        // console.log(token);

        // cookie name is Amazonweb
        // generate cookie with the help of token
        res.cookie("test", token, {
          expires: new Date(Date.now() + 8.64e7),
          httpOnly: true,
        });

        res.status(201).json(userLogin);
      }
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details1!!!" });
  }
});

//addidng data into cart
//create api
/* jaise add to cart api call hoti hai to pehle authentication function call ho ga
phr cookie ki value get ho gi phr verify ho gi secret key ke sath verfiy hone ke bad
id mile gi phr us id se user mile ga 
 */
router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart value");
    // user milta hai id ki help se
    const userContact = await USER.findOne({ _id: req.userID });
    console.log(userContact);
    // if user find then we add data into cart
    if (userContact) {
      const cartData = await userContact.addCartData(cart);
      await userContact.save();
      console.log(userContact);
      res.status(201).json(userContact);
    } else {
      res.status(400).json({ error: "Invalid User!!!" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid User!!!" });
  }
});

// get cart details
// use middleware (authenticate)
// cart ki details get krni uski API create ki

router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    /*pehle user find kare gy us user ke andar cart ki value store ho gi*/
    /*jo authenticate se id mil rahi us se user ko find kare gy*/
    const buyUser = await USER.findOne({ _id: req.userID });
    /* response send to frontEnd in JSON form*/
    res.status(201).json(buyUser);
  } catch (error) {
    console.log("error" + error);
  }
});

// get valid user api

router.get("/validuser", authenticate, async (req, res) => {
  try {
    /*jese ye valid user call kare ga function, authentication ke page pr
      cookie or secretkey verify ho gi pr user mile ga use frontend pe show
      krwain gy*/
    const valideUserOne = await USER.findOne({ _id: req.userID });
    /* response send to frontEnd in JSON form*/
    res.status(201).json(valideUserOne);
  } catch (error) {
    console.log("error" + error);
  }
});

// remove item from cart
/*jb kisi bhi item pe delete button ko click kare gy uski jo id ho gi wo hame
mil jai gi req.params se phr authenticate page se cookie verify ho jai gi phr
user mil jai ga user mil jata hai phr uske cart me filter kare gy, user ke cart 
jo item ho gi uski value or jo user value send kare ga unki value match na ho
phr sari items return krwain gy*/
router.delete("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((currentValue) => {
      return currentValue.id != id;
    });
    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("Item Remove");
  } catch (error) {
    console.log("error" + error);
    res.status(400).json(req.rootUser);
  }
});

// for user logout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currentElement) => {
      return currentElement.token !== req.token;
    });

    res.clearCookie("test", { path: "/" });

    req.rootUser.save();

    res.status(201).json(req.rootUser.tokens);
    console.log("User Logout");
  } catch (error) {
    console.log("Error For User LogOut");
  }
});

module.exports = router;
