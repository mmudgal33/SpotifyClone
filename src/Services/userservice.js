const User = require('../Models/usermodel');

const registerUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }
 
    return { token: 'JWT_TOKEN_PLACEHOLDER', user };
};

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

const updateUserProfile = async (userId, updates) => {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
