const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email Address");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    maxlength: 11,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  // store token value
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  carts: Array,
});

//to store user data save in dataBase
userSchema.pre("save", async function (next) {
  /*jese data save ho jai us se pehle middleware function ko call kare gy or waha 
    per hm log hmare password ko becrypt kare gy 12 rounds ho gy*/
  // if we want to modified the password then change into hash password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
  }
  next();
});

//token generate
// _id is databaseID
// password match then this function is call
/* use mongoose instance method ka uski help se is function ko call krwain gy
q ke agar hmare database ke andar koi data add hai uske andar hame extra data 
add krna ho to is tarha is function ko call kr ke add bhi kr skte
*/
//in try catch block we create variable token in it we generate token using jwt
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, secretKey);
    this.tokens = this.tokens.concat({ token: token });
    await this.save(); // save token
    return token;
  } catch (error) {
    console.log(error);
  }
};

// add to cart data
userSchema.methods.addCartData = async function (cart) {
  try {
    this.carts = this.carts.concat(cart);
    await this.save();
    return this.carts;
  } catch (error) {
    console.log(error);
  }
};

const USER = new mongoose.model("USER", userSchema);

module.exports = USER;
