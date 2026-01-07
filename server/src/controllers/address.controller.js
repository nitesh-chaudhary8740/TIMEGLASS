// @desc    Add new address

import User from "../models/user.model.js";
import asyncHandler from "../utils/asynchandler.util.js";

// @route   POST /api/user/address
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Logic: If this is the first address or marked as default, 
  // unset any existing default addresses.
  if (req.body.isDefault || user.addresses.length === 0) {
    user.addresses.forEach(addr => addr.isDefault = false);
    req.body.isDefault = true;
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    success: true,
    user: user // Returning user to sync Redux state
  });
});

// @desc    Update specific address (or set as default)
// @route   PATCH /api/user/address/:id
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Logic: If setting this address as default, unset others
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  // Update the fields provided in request body
  Object.assign(address, req.body);

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Delete an address
// @route   DELETE /api/user/address/:id
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Mongoose filter to remove sub-document
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id
  );

  // UX Logic: If we deleted the default address, make the first one the new default
  if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.status(200).json({ success: true, user });
});