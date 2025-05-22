import { json } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"

// placing orders using COD method
const placeOrder = async (req, res)=>{
    try {
        const {userId, items, amount, address,order_id} = req.body;
        const orderData = {
           order_id,
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success:true, message:"Order Placed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


// all Orders data for admin panel
const allOrders = async (req, res)=>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// all Order data for frontend
const userOrders = async (req, res)=>{
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// update order status from admin panel
const updateStatus = async (req, res)=>{
    try {
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:'Status Updated'})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}
// Cancel a specific item from an order
const cancelOrderItem = async (req, res) => {
    try {
      const { orderId, itemId } = req.body;
  
      // Find the order
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }
  
      // Filter out the item
      const updatedItems = order.items.filter(item => item._id.toString() !== itemId);
  
      // If all items are removed, you could also optionally delete the order (optional)
      if (updatedItems.length === 0) {
        await orderModel.findByIdAndDelete(orderId);
        return res.json({ success: true, message: "Order cancelled completely" });
      }
  
      // Update the order with remaining items
      order.items = updatedItems;
      await order.save();
  
      res.json({ success: true, message: "Item cancelled successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

// Delete an entire order by orderId
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Check if order exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Delete the order
    await orderModel.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

  

export {placeOrder, allOrders, userOrders, updateStatus, cancelOrderItem, deleteOrder}