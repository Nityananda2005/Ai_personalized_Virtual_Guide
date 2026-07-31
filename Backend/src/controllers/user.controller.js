const { upsertUserProfile, getUserProfile } = require('../services/personalization.service');

/**
 * Save or update user profile.
 * 
 * @route POST /api/user/profile
 */
async function saveProfile(req, res) {
  try {
    const { userId, name, email, preferredLanguage, department, semester, learningGoal, interests } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "userId" and "name" are required fields.',
      });
    }

    const profile = await upsertUserProfile(userId, {
      name,
      email,
      preferredLanguage,
      department,
      semester,
      learningGoal,
      interests,
    });

    return res.status(200).json({
      success: true,
      message: 'User profile saved successfully.',
      profile: profile,
    });
  } catch (error) {
    console.error('Error in saveProfile controller:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while saving user profile.',
    });
  }
}

/**
 * Fetch user profile by userId.
 * 
 * @route GET /api/user/profile/:userId
 */
async function getProfile(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId parameter is required.',
      });
    }

    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `No user profile found for userId '${userId}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      profile: profile,
    });
  } catch (error) {
    console.error('Error in getProfile controller:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while retrieving user profile.',
    });
  }
}

module.exports = {
  saveProfile,
  getProfile,
};
