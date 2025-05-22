import express from 'express'
import { EsewaInitiatePayment, paymentStatus } from '../controllers/esewaController.js';
import authUser from '../middleware/auth.js';
export const esewaRouter = express.Router()

esewaRouter.post("/payment-initiate",authUser,EsewaInitiatePayment)
esewaRouter.post("/payment-status", paymentStatus);