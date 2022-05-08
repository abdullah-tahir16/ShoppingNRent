const Orders = require("../models/orders");

// create order
exports.createOrder = async (req, res) => {
  try {
    const order = await Orders.create({
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      msg: "Order created successfully",
      data: req.body,
      id: order._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error creating order" });
  }
};

// get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ ordered_by: req.params.user_id }).lean();

    if (!orders.length) {
      return res.status(404).json({ success: false, msg: "Orders not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Orders found successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error fetching orders" });
  }
};

// get order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findOne({ _id: req.params.order_id }).lean();

    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Order found successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error fetching order" });
  }
};

// delete order by id
exports.deleteOrderById = async (req, res) => {
  try {
    await Orders.deleteOne({ _id: req.params.order_id });

    return res.status(200).json({
      success: true,
      msg: "Order deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error deleting order" });
  }
};
