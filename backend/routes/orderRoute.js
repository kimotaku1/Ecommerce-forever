import express from "express"
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from "../middleware/auth.js"
const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)   /////esewa/////

// User features
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter

