import User from "../models/user.model.js";

// Controllers/userController.js
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-otp').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// adminUserController.js (Example)
export const getUserDetails = async (req, res) => {
    const user = await User.findById(req.params.id)
        .populate("orderHistory") // This will now work because the IDs are being pushed!
        .select("-otp");
console.log(user)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        success: true,
        user,
        orders: user.orderHistory // Send populated history as orders
    });
};