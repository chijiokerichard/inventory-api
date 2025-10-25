const crypto = require("crypto-js");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema

const personSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    require:true,
    default:false
  },
  isStaff:{
    type:Boolean,
    require:true,
    default:false
  },
  isVerified:{
    type:Boolean,
    default: false,
  },
    verifyToken: String,
    verifyTokenExpiry: Date,

  canDelete:{
    type:Boolean,
    require:true,
    default:false
  },
//   favoriteFoods: [String],
});

personSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



personSchema.methods.createVerificationToken = function() {
    // 1. Generate a raw, cryptographically secure 6-digit number (OTP)
    // We generate 3 random bytes (24 bits) and use modulo/toString to get a 6-digit number
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    
    // Generate a random number between min and max
    const randomBuffer = crypto.randomBytes(4); // Use 4 bytes for sufficient randomness
    const rawVerificationToken = (randomBuffer.readUInt32BE(0) % (max - min + 1)) + min;
    
    // Ensure it's a string for hashing and comparison later
    const tokenString = rawVerificationToken.toString(); 

    // 2. HASH the raw OTP before saving it to the database
    // The token is short, so hashing it is crucial for security.
    this.verifyToken = crypto
        .createHash('sha256') 
        .update(tokenString)
        .digest('hex');

    // 3. Set a short expiration date (e.g., token expires in 15 minutes)
    // 900000 milliseconds = 15 minutes
    this.verifyTokenExpiry = Date.now() + 900000; 

    return tokenString;
};

// 🔹 Compare password method
personSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  pub_date: { type: Date, default: Date.now,required:false },
  category:{
      type:Schema.Types.ObjectId,
      ref:"ProductCategory",
      required:true,
      default:null
    },
//   expiry_date: { type: Date, required: true },
})

const productCategorySchema = new Schema({
  category_name: { type: String, required: true },
  pub_date: { type: Date, default: Date.now },
//   expiry_date: { type: Date, required: true },
})
const Person = mongoose.model("Person", personSchema, "users");
const Products = mongoose.model("Products", productSchema, "products");
const ProductCateory = mongoose.model("ProductCategory", productCategorySchema, "productCategories");
module.exports = {Person,Products,ProductCateory};
