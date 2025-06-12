import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  userModel from '../models/userModel.js'

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.status(200).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate name: should contain only letters and spaces
        const nameRegex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces
        if (!nameRegex.test(name)) {
            return res.status(400).json({ success: false, message: "Name should only contain letters and spaces" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password: Must be at least 8 characters long, with a letter, a number, and a special character
        if (password.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and include a number, a letter, and a special character." });
        }

        // Hash password before saving to database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate a token for the new user
        const token = createToken(newUser._id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// route for admin login
const adminLogin = async (req, res)=>{
    try {
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        }else{
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
} 

export {loginUser, registerUser, adminLogin} 