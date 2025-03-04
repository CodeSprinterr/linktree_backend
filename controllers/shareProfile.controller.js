const userModel = require("../models/user.model");
const userUrls = require("../models/userUrl.model");
const clickModel = require("../models/clicks.model");
const UserProfileAppearance = require('../models/userProfileAppearance.model');

exports.getUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }

        // Find user by username
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find user links
        const userLinks = await userUrls.find({ userId: user.id });

        // Find user links
        const appearance = await UserProfileAppearance.findOne({ userId: user.id });

        res.status(200).json({
            success: true,
            user,
            links: userLinks,
            appearance
        });

    } catch (err) {
        console.error("Error fetching user:", err);
        next(err);
    }
};

exports.updateClicks = async (req, res, next) => {
    try {
        const { username, clickType, buttonName } = req.body;
        const deviceType = req.device.type;

        const userAgent = req.get('User-Agent') || '';

        // Detect platform using regex
        let devicePlatform = 'Unknown';
        if (/windows/i.test(userAgent)) devicePlatform = 'Windows';
        else if (/mac os/i.test(userAgent)) devicePlatform = 'MacOS';
        else if (/android/i.test(userAgent)) devicePlatform = 'Android';
        else if (/iphone|ipad|ipod/i.test(userAgent)) devicePlatform = 'iOS';
        else if (/linux/i.test(userAgent)) devicePlatform = 'Linux';


        if (!username || !clickType || !buttonName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newClick = new clickModel({
            userId: user._id,
            username,
            clickType,
            buttonName,
            deviceType: devicePlatform
        });

        await newClick.save();

        res.status(200).json({ success: true, message: "Click recorded successfully" });
    } catch (err) {
        console.error("Error recording click:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAnalyticsData = async (req, res, next) => {
    try {
        const analyticsData = await clickModel.find({ userId: req.user.id });

        res.status(200).json({
            success: true,
            message: "data fetched successfully.",
            analytics: analyticsData
        });
    } catch (err) {
        next(err);
    }
}

exports.updateApperance = async (req, res, next) => {
    try {
        const userId = req.user.id; // Authenticated user ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const updateFields = req.body; // Only fields that have changed

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // Update only the changed fields
        const updatedAppearance = await UserProfileAppearance.findOneAndUpdate(
            { userId },
            { $set: updateFields },
            { new: true, upsert: true } // Upsert to create if not exists
        );

        res.status(200).json({
            message: "Appearance updated successfully",
            data: updatedAppearance,
        });
    } catch (err) {
        next(err);
    }
};

exports.getApperance = async (req, res, next) => {
    try {
        // Find user by username
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find user links
        const appearance = await UserProfileAppearance.findOne({ userId: user.id });

        res.status(200).json({
            success: true,
            appearance
        });

    } catch (err) {
        console.error("Error fetching user:", err);
        next(err);
    }
};
