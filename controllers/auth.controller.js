const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false,  message: "Email already exists" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        const data = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }
        const payload = {
            id: user._id,
            name: user.name,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.json({
            success: true,
            user : data,
            token,
            message: "User registered successfully"
        }).status(200);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json(
                { 
                    success: false,
                    message: "Email already in use" 
                });
        }
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await userModel.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
        const payload = {
            id: user._id,
            name: user.name,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);

        var redirectURl = '/dashboard';
        if(user.username == null && user.category == null){
            redirectURl = '/tell-us-more';
        }

        const data = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }
        
        res.json({
            token,
            user : data,
            redirectURl,
            message: "Login successful"
        }).status(200);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, password } = req.body;

        const updateFields = {}; 

        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) {
            const existingUser = await userModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            updateFields.email = email;
        }
        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (err) {
        next(err);
    }
};