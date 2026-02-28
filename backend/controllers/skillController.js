const Skill = require("../models/Skill");

// Create skill
exports.createSkill = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;

    const skill = await Skill.create({
      title,
      description,
      category,
      level,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};