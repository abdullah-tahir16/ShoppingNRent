const Administrator = require("../models/administrator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createAdminstrator = async (req, res) => {
  try {
    const { password, username } = req.body;
    const hashed_password = await bcrypt.hash(password, 10); // Use 10 as the salt rounds

    const user_data = await Administrator.create({
      username,
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

const loginAdmin = async (req, res) => {
  const { password, username } = req.body;

  try {
    const admin = await Administrator.findOne({ username }).lean();
    if (!admin) {
      return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }

    const is_match = await bcrypt.compare(password, admin.password);
    if (!is_match) {
      return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }
    if (!admin.approved) {
      return res.status(404).json({ success: false, msg: "Account pending approval." });
    }

    const payload = { admin: { id: admin._id } };
    await Administrator.updateOne({ _id: admin._id }, { $push: { timeLogs: Date.now() }});

    const token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const getUsersByRole = async (req, res, role) => {
  try {
    const users = await User.find({ role }).lean();

    if (users.length < 1) {
      return res.status(404).json({ success: false, msg: `${role} not found` });
    }

    return res.status(200).json({
      success: true,
      msg: `${role} found`,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const getAllBuyers = async (req, res) => getUsersByRole(req, res, "buyer");
const getAllSellers = async (req, res) => getUsersByRole(req, res, "seller");
const getAllBoth = async (req, res) => getUsersByRole(req, res, "both");

module.exports = {
  createAdminstrator,
  loginAdmin,
  getAllBuyers,
  getAllSellers,
  getAllBoth,
};
