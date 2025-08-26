// controllers/referralPartnerController.js
import User from "../models/user.js";
//import Payment from "../models/payment.js";

// ✅ Get my profile
export const getProfile = async (req, res) => {
  try {
    const partner = await User.findById(req.user.id).select("-password");
    if (!partner || partner.role !== "referralpartner") {
      return res.status(403).json({ message: "Not a referral partner" });
    }
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all students who used my referral code
export const myReferrals = async (req, res) => {
  try {
    const partner = await User.findById(req.user.id);
    if (!partner || partner.role !== "referralpartner") {
      return res.status(403).json({ message: "Not a referral partner" });
    }

    const students = await User.find({ role: "student", referralCode: partner.referralCode }).select("name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get my earnings (commission logic)
export const myEarnings = async (req, res) => {
  try {
    const partner = await User.findById(req.user.id);
    if (!partner || partner.role !== "referralpartner") {
      return res.status(403).json({ message: "Not a referral partner" });
    }

    // Find students who used my referral code
    const students = await User.find({ role: "student", referralCode: partner.referralCode }).select("_id");
    const studentIds = students.map(s => s._id);

    // Find payments from those students
    const payments = await Payment.find({ student: { $in: studentIds }, status: "success" });

    // Commission logic
    const referredCount = students.length;
    let rate = 0.01; // default 1%
    if (referredCount >= 11 && referredCount <= 20) rate = 0.025;
    else if (referredCount >= 21 && referredCount <= 40) rate = 0.05;
    else if (referredCount > 40) rate = 0.10;

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const commission = totalRevenue * rate;

    res.json({ referredCount, rate, totalRevenue, commission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Request settlement (stored as pending for Finance Manager)
export const requestSettlement = async (req, res) => {
  try {
    // For now, just return a response; later finance manager handles
    res.json({ message: "Settlement request sent to Finance Manager (to be implemented)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
