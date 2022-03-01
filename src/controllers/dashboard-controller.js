const Administrator = require("../models/administrator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user")

exports.createAdminstrator = async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const { password, username } = req.body;
      const hashed_password = await bcrypt.hash(password, salt); // Encrypting password before saving it in DB
  
      const user_data = await Administrator.create({
        username: username,
        password: hashed_password,
      });
  
      return res.status(200).json({
        success: true,
        msg: "Administrator created successfully",
        id: user_data._id,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, msg: "Error creating user" });
    }
  };

  exports.loginAdmin = async (req, res) => {
    const { password, username } = req.body;
  
    try {
      const admin = await Administrator.findOne({
        username: username,
      }).lean();
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, msg: "Invalid credentials" });
      }
  
      const is_match = await bcrypt.compare(password, admin.password); // Matching encrypted passwords
      if (!is_match) {
        return res
          .status(404)
          .json({ success: false, msg: "Invalid credentials" });
      }
      if (!admin.approved) {
        return res
          .status(404)
          .json({ success: false, msg: "Account pending approval." });
      }
      const payload = {
        admin: {
          id: admin._id,
        },
      };
      await Administrator.updateOne(
        { _id: admin._id },
        { $push: { timeLogs: Date.now() } }
      );
      return res.status(200).json({
        success: true,
        token: jwt.sign(payload, process.env.JWT_SECRET_ADMIN, {
          expiresIn: "1h",
        }),
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(400)
        .json({ success: false, msg: "Service is down. Contact administrator" });
    }
  };

  exports.getAllBuyers = async (req, res) => {
    try {
      const buyers = await User.find({role:"buyer"}).lean();
  
      if (buyers.length < 1) {
        return res
          .status(404)
          .json({ success: false, msg: "Buyer Accounts not found" });
      }
      return res.status(200).json({
        success: true,
        msg: "Buyer Accounts found",
        data: buyers,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, msg: "Service is down. Contact administrator" });
    }
  };

  exports.getAllSellers = async (req, res) => {
    try {
      const sellers = await User.find({role:"seller"}).lean();
  
      if (sellers.length < 1) {
        return res
          .status(404)
          .json({ success: false, msg: "Sellers not found" });
      }
      return res.status(200).json({
        success: true,
        msg: "Sellers found",
        data: sellers,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, msg: "Service is down. Contact administrator" });
    }
  };

  exports.getAllBoth = async (req, res) => {
    try {
      const both = await User.find({role:"both"}).lean();
  
      if (both.length < 1) {
        return res
          .status(404)
          .json({ success: false, msg: "both not found" });
      }
      return res.status(200).json({
        success: true,
        msg: "both found",
        data: both,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, msg: "Service is down. Contact administrator" });
    }
  };