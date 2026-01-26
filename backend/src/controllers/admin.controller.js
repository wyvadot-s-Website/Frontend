// controllers/admin.controller.js
export const getAdminMe = async (req, res) => {
  try {
    // protectAdmin already attached req.admin (without password)
    return res.json({
      success: true,
      admin: req.admin,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
