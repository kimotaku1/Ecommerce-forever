import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  // New: Remove order handler
  const removeOrderHandler = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order?")) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete`,
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order removed successfully");
        // Remove order from state
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      } else {
        toast.error(response.data.message || "Failed to remove order");
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>

      {orders.length === 0 ? (
        <div className="text-gray-500 italic text-center py-10">
          No orders have been placed yet.
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              {/* Order Icon and Summary */}
              <div className="flex items-start gap-4">
                <img src={assets.parcel_icon} alt="Parcel" className="w-12 h-12" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex-1">
                <h5 className="font-semibold text-gray-700 mb-2">Items</h5>
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity} {item.size && `(${item.size})`}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Address Info */}
              <div className="text-sm text-gray-700">
                <h5 className="font-semibold mb-2">Shipping Address</h5>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                <p>📞 {order.address.phone}</p>
              </div>

              {/* Payment and Action */}
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-semibold">Total:</span> {currency}{order.amount}</p>
                <p><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold">Payment:</span> 
                  <span className={`ml-1 font-semibold ${order.payment ? "text-green-600" : "text-red-500"}`}>
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>

                <div>
                  <label className="block font-semibold mb-1">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeOrderHandler(order._id)}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
                >
                  Remove Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
