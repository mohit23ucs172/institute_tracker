// Controller: user.controller.js
exports.assignCommittee = async (req, res) => {
  try {
    const { userId, committeeId } = req.body;
    
    // Find the user and push the new committee ID into their assignedCommittees array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { assignedCommittees: committeeId } }, // $addToSet prevents duplicates
      { new: true }
    );

    res.status(200).json({ message: "Access granted successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating permissions" });
  }
};