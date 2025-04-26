const User = require("../../models/User");

const userDetails = async (req, res) => {
    try {
      // Fetch user details from the database using the userId set by the middleware
      const user = await User.findById(req.userId).select('username email'); // Customize the fields you want to return
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Return user details
      return res.status(200).json({
        success: true,
        userName: user.username, // Assuming you need the username
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = userDetails;