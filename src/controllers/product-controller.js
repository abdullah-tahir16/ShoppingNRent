const Product = require("../models/products");
const User = require("../models/user");
const { sendMail } = require("../services/emailer");

const createProduct = async (req, res) => {
  try {
    const { userId, name, city, description, pictureLink, active, discount, otherInfo, details, price, category, condition, make } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, msg: "Please Provide UserId" });
    }

    const user = await User.findOne({ _id: userId }, { password: false, __v: false }).lean();

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid userid" });
    }

    const product = await Product.create({
      name,
      city,
      description,
      picture_link: pictureLink,
      active,
      discount,
      other_information: otherInfo || "Blank field",
      created_at: Date.now(),
      details,
      price,
      category,
      condition,
      make,
      created_by: user,
    });

    await sendMail(
      user.email,
      "Your Product has been added Successfully",
      `${name} <br> put your additional html here ShoppingNRent Team`
    );

    return res.status(200).json({
      success: true,
      msg: "Product created successfully",
      data: req.body,
      id: product._id,
      referenceId: product.reference_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Error creating Product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const updateObject = {};

    if (!id) {
      return res.status(400).json({ success: false, msg: "Invalid record" });
    }

    // Define properties to update
    const updateFields = ["name", "details", "city", "description", "pictureLink", "otherInfo", "condition", "price", "make", "active", "category", "discount"];
    for (const field of updateFields) {
      if (req.body[field]) {
        updateObject[field] = req.body[field];
      }
    }

    const updateSingleProduct = await Product.findOneAndUpdate({ _id: id }, updateObject).lean();

    return res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: req.body,
      id: updateSingleProduct._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Error while updating Product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product } = req.body;

    if (product.length < 1) {
      return res.status(400).json({ success: false, msg: "Empty array cannot be deleted" });
    }

    await Product.updateMany({ _id: { $in: product } }, { $set: { deleted: true } });

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const getProductByCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ success: false, msg: "Invalid search query" });
    }

    const productByCity = await Product.find({
      city: { $regex: new RegExp("^" + city, "i") },
      deleted: false,
    }).lean();

    if (!productByCity || productByCity.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No records found",
      });
    } else {
      return res.status(200).json({ success: true, data: productByCity });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

const getProductBySeller = async (req, res) => {
  try {
    const { created_by } = req.body;

    if (!created_by) {
      return res.status(400).json({ success: false, msg: "Invalid search query" });
    }

    const productBySeller = await Product.find({
      created_by,
      deleted: false,
    }).lean();

    if (!productBySeller || productBySeller.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No records found",
      });
    } else {
      return res.status(200).json({ success: true, data: productBySeller });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCity,
  getProductBySeller,
};
