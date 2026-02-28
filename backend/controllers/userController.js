// ==================== backend/controllers/userController.js ====================
const User = require('../models/User');

// @desc    Get all users (for finding mentors)
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: 'student',
            isBlocked: false 
        }).select('-password');
        
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, branch, year, skillsOffered, skillsWanted, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.branch = branch || user.branch;
            user.year = year || user.year;
            user.skillsOffered = skillsOffered || user.skillsOffered;
            user.skillsWanted = skillsWanted || user.skillsWanted;
            user.avatar = avatar || user.avatar;

            const updatedUser = await user.save();

            res.json({
                success: true,
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
                role: updatedUser.role,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get mentors by skill
// @route   GET /api/users/mentors/:skill
// @access  Private
exports.getMentorsBySkill = async (req, res) => {
    try {
        const { skill } = req.params;
        
        const mentors = await User.find({
            skillsOffered: { $regex: skill, $options: 'i' },
            role: 'student',
            isBlocked: false
        }).select('-password');

        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};