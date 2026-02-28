// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, branch, year, skillsOffered, skillsWanted } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            branch,
            year,
            skillsOffered: skillsOffered || [],
            skillsWanted: skillsWanted || [],
            walletBalance: 100, // Initial 100 coins
            totalSessions: 0,
            rating: 0,
            reviewCount: 0,
            role: 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                branch: user.branch,
                year: user.year,
                skillsOffered: user.skillsOffered,
                skillsWanted: user.skillsWanted,
                walletBalance: user.walletBalance,
                totalSessions: user.totalSessions,
                rating: user.rating,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Contact admin.' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            branch: user.branch,
            year: user.year,
            skillsOffered: user.skillsOffered,
            skillsWanted: user.skillsWanted,
            walletBalance: user.walletBalance,
            totalSessions: user.totalSessions,
            rating: user.rating,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, branch, year, skillsOffered, skillsWanted } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.branch = branch || user.branch;
            user.year = year || user.year;
            user.skillsOffered = skillsOffered || user.skillsOffered;
            user.skillsWanted = skillsWanted || user.skillsWanted;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                branch: updatedUser.branch,
                year: updatedUser.year,
                skillsOffered: updatedUser.skillsOffered,
                skillsWanted: updatedUser.skillsWanted,
                walletBalance: updatedUser.walletBalance,
                totalSessions: updatedUser.totalSessions,
                rating: updatedUser.rating,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};