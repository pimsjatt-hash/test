//  // src/middleware/rbac.js
// export const allowRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     const user = req.user; // req.user should come from auth middleware (JWT)
//       console.log("RBAC check:", { userRole: user?.role, allowedRoles });
//     if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

//     if (!allowedRoles.includes(user.role)) {
//       return res.status(403).json({ success: false, message: "Forbidden: Role not allowed"});
//     }
//     next();
//   };
// };

// // Fixed sub-admin role guard
// export const requireSubAdminRole = (...allowedSubAdminRoles) => {
//   return (req, res, next) => {
//     const user = req.user;
//     if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
//     if (user.role !== "sub-admin") {
//       return res.status(403).json({ success: false, message: "Forbidden: Not a sub-admin" });
//     }
//     if (!allowedSubAdminRoles.includes(user.subAdminRole)) {
//       return res.status(403).json({ success: false, message: "Forbidden: Sub-admin role not allowed" });
//     }
//     next();
//   };
// };

// // Dynamic sub-role guard (only for sub-admins)
// export const requireDynamicSubRole = (...allowedDynamicRoles) => {
//   return (req, res, next) => {
//     const user = req.user;
//     if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
//     if (user.role !== "sub-admin") {
//       return res.status(403).json({ success: false, message: "Forbidden: Not a sub-admin" });
//     }
//     if (!allowedDynamicRoles.includes(user.dynamicSubRole)) {
//       return res.status(403).json({ success: false, message: "Forbidden: Dynamic sub-role not allowed" });
//     }
//     next();
//   };
// };

// // Approved status guard
// export const requireApproved = () => {
//   return (req, res, next) => {
//     const user = req.user;
//     if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
//     if (user.status !== "approved") {
//       return res.status(403).json({ success: false, message: "Access denied: Account not approved" });
//     }
//     next();
//   };
// };

// // Add at the bottom of src/middleware/rbac.js



// src/middleware/rbac.js

/**
 * Generic role guard
 * Example: allowRoles("superadmin", "university")
 */
export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    console.log("RBAC check:", { userRole: user?.role, allowedRoles });

    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role ${user.role} not allowed`
      });
    }
    next();
  };
};

/**
 * Require a specific sub-admin role (fixed role)
 * Example: requireSubAdminRole("financeManager")
 */
export const requireSubAdminRole = (...allowedSubAdminRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.role !== "sub-admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Not a sub-admin" });
    }

    if (!allowedSubAdminRoles.includes(user.subAdminRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Sub-admin role ${user.subAdminRole} not allowed`
      });
    }
    next();
  };
};

/**
 * Require dynamic sub-admin role (like certificateOfficer, governance, etc.)
 */
export const requireDynamicSubRole = (...allowedDynamicRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.role !== "sub-admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Not a sub-admin" });
    }

    if (!allowedDynamicRoles.includes(user.dynamicSubRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Dynamic sub-role ${user.dynamicSubRole} not allowed`
      });
    }
    next();
  };
};

/**
 * Guard: user must be approved
 */
export const requireApproved = () => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Account not approved"
      });
    }
    next();
  };
};
