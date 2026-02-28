// ==================== backend/controllers/sessionController.js ====================
const Session = require('../models/Session');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Book a new session
// @route   POST /api/sessions/book
// @access  Private
exports.bookSession = async (req, res) => {
    try {
        const { mentorId, skill } = req.body;
        const learnerId = req.user._id;

        // Prevent self-booking
        if (mentorId === learnerId.toString()) {
            return res.status(400).json({ message: 'Cannot book a session with yourself' });
        }

        // Get mentor details
        const mentor = await User.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        if (mentor.isBlocked) {
            return res.status(400).json({ message: 'Cannot book with blocked user' });
        }

        // Check if mentor offers this skill
        const skillLower = skill.toLowerCase().trim();
        const offersSkill = mentor.skillsOffered.some(
            s => s.toLowerCase().trim() === skillLower
        );

        if (!offersSkill) {
            return res.status(400).json({ message: 'Mentor does not offer this skill' });
        }

        // Get learner details
        const learner = await User.findById(learnerId);
        if (!learner) {
            return res.status(404).json({ message: 'Learner not found' });
        }

        // Check learner balance
        if (learner.skillCoins < 1) {
            return res.status(400).json({ message: 'Insufficient skill coins' });
        }

        // Create session
        const session = await Session.create({
            mentor: mentorId,
            learner: learnerId,
            skill: skillLower,
            status: 'pending'
        });

        // Deduct coin from learner
        learner.skillCoins -= 1;

        // Add coin to mentor
        mentor.skillCoins += 1;

        await learner.save();
        await mentor.save();

        // Record transaction
        await Transaction.create({
            from: learnerId,
            to: mentorId,
            amount: 1,
            type: 'session-booking',
            session: session._id
        });

        res.status(201).json({
            message: 'Session booked successfully',
            session
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};