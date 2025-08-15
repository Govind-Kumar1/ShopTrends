

import orderModel from "../models/orderModel.js";

// Controller to fetch all orders for a specific user
const listOrders = async (req, res) => {
    try {
        // Find orders that match the logged-in user's ID
        const orders = await orderModel.find({ userId: req.user.id });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
}

export { listOrders };