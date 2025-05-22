import express from "express";
import newsletterModel from "../models/newsLetter.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    // Check for duplicate
    const exists = await newsletterModel.findOne({ email });

    if (exists) {
      return res.status(409).json({ success: false, message: "Email already subscribed." });
    }

    await newsletterModel.create({ email });
    return res.status(200).json({ success: true, message: "Subscribed successfully." });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
