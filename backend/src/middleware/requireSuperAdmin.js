// backend/middleware/requireSuperAdmin.js

const requireSuperAdmin = (req, res, next) => {
  // protectAdmin must run first (so req.admin exists)
  const role = req.admin?.role;

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: super_admin only",
    });
  }

  next();
};

export default requireSuperAdmin;
