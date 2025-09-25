 import Wallet from "../models/wallet.js";
import mongoose from "mongoose";
 
export const getPendingSettlements = async (req, res) => {
  try {
    const wallets = await Wallet.find({
      "transactions.status": "pending",
      "transactions.type": { $in: ["settlement_request", "credit"] }
    })
      .populate("transactions.studentId", "name email")
      .populate("transactions.courseId", "title price")
      .populate("ownerId", "name email role");

    res.json({ success: true, wallets });
  } catch (err) {
    console.error("Error in getPendingSettlements:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
 

// export const approveSettlement = async (req, res) => {
//   try {
//     const { walletOwnerId, transactionId, split } = req.body;

//     // Validate required fields
//     if (!walletOwnerId || !transactionId || !split) {
//       return res.status(400).json({ message: "walletOwnerId, transactionId, and split are required" });
//     }

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(walletOwnerId)) {
//       return res.status(400).json({ message: "Invalid walletOwnerId" });
//     }

//     // Find wallet by ownerId or fallback to wallet _id
//     let wallet = await Wallet.findOne({ ownerId: walletOwnerId });
//     if (!wallet) wallet = await Wallet.findById(walletOwnerId);
//     if (!wallet) return res.status(404).json({ message: "Wallet not found" });

//     // Find transaction
//     const transaction = wallet.transactions.id(transactionId);
//     if (!transaction || transaction.status !== "pending") {
//       return res.status(400).json({ message: "Transaction not found or already processed" });
//     }

//     const totalAmount = transaction.amount;
//     const { teacher: teacherShare = 0, university: universityShare = 0, platform: platformShare = 0 } = split;

//     // Ensure splits don’t exceed total
//     if (teacherShare + universityShare + platformShare > totalAmount) {
//       return res.status(400).json({ message: "Split exceeds total transaction amount" });
//     }

//     // Update transaction
//     transaction.split = { teacher: teacherShare, university: universityShare, platform: platformShare };
//     transaction.status = "approved_by_finance";

//     // Deduct total pending amount from wallet
//     wallet.balance -= totalAmount;

//     // Credit respective wallets
//     if (wallet.ownerType === "teacher" && teacherShare > 0) {
//       // Teacher wallet itself
//       wallet.balance += teacherShare;
//     }

//     if (wallet.ownerType === "university" && universityShare > 0) {
//       wallet.balance += universityShare;
//     }

//     if (wallet.ownerType === "referral") {
//       // Referral wallet gets teacher + university shares if present
//       wallet.balance += teacherShare + universityShare;
//     }

//     // Handle linked teacher wallet if transaction has teacherId
//     if (transaction.teacherId && teacherShare > 0) {
//       const teacherWallet = await Wallet.findOne({ ownerId: transaction.teacherId });
//       if (teacherWallet) {
//         teacherWallet.balance += teacherShare;
//         await teacherWallet.save();
//       }
//     }

//     // Handle linked university wallet if transaction has universityId
//     if (transaction.universityId && universityShare > 0) {
//       const universityWallet = await Wallet.findOne({ ownerId: transaction.universityId });
//       if (universityWallet) {
//         universityWallet.balance += universityShare;
//         await universityWallet.save();
//       }
//     }

//     await wallet.save();

//     res.json({ success: true, message: "Settlement approved", wallet });
//   } catch (err) {
//     console.error("Error in approveSettlement:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
export const approveSettlement = async (req, res) => {
  try {
    const { walletOwnerId, transactionId, split } = req.body;
    if (!walletOwnerId || !transactionId || !split)
      return res.status(400).json({ message: "walletOwnerId, transactionId, and split are required" });

    let wallet = await Wallet.findOne({ ownerId: walletOwnerId }) || await Wallet.findById(walletOwnerId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const transaction = wallet.transactions.id(transactionId);
    if (!transaction || transaction.status !== "pending")
      return res.status(400).json({ message: "Transaction not found or already processed" });

    const { teacher: teacherShare = 0, university: universityShare = 0, platform: platformShare = 0 } = split;
    const totalAmount = transaction.amount;

    if (teacherShare + universityShare + platformShare > totalAmount)
      return res.status(400).json({ message: "Split exceeds total transaction amount" });

    // Update transaction
    transaction.split = { teacher: teacherShare, university: universityShare, platform: platformShare };
    transaction.status = "approved_by_finance";

    // Deduct total pending amount from wallet
    wallet.balance -= totalAmount;

    // Handle teacher wallet
    const teacherId = transaction.teacherId || wallet.teacherId;
    if (teacherId && teacherShare > 0) {
      const teacherWallet = await Wallet.findOne({ ownerId: teacherId, ownerType: "teacher" });
      if (teacherWallet) {
        teacherWallet.balance += teacherShare;
        await teacherWallet.save();
      } else if (wallet.ownerType === "teacher") {
        // If wallet itself is teacher wallet
        wallet.balance += teacherShare;
      }
    }

    // Handle university wallet
    const universityId = transaction.universityId || wallet.universityId;
    if (universityId && universityShare > 0) {
      const universityWallet = await Wallet.findOne({ ownerId: universityId, ownerType: "university" });
      if (universityWallet) {
        universityWallet.balance += universityShare;
        await universityWallet.save();
      } else if (wallet.ownerType === "university") {
        wallet.balance += universityShare;
      }
    }

    // Handle referral wallet
    if (wallet.ownerType === "referral") {
      wallet.balance += teacherShare + universityShare;
    }

    await wallet.save();
    res.json({ success: true, message: "Settlement approved", wallet });
  } catch (err) {
    console.error("Error in approveSettlement:", err);
    res.status(500).json({ message: err.message });
  }
};


// export const rejectSettlement = async (req, res) => {
//   try {
//     const { walletOwnerId, transactionId } = req.body;

//     if (!walletOwnerId || !transactionId) {
//       return res.status(400).json({ message: "walletOwnerId and transactionId are required" });
//     }

//     // Validate walletOwnerId as ObjectId
//     if (!mongoose.Types.ObjectId.isValid(walletOwnerId)) {
//       return res.status(400).json({ message: "Invalid walletOwnerId" });
//     }

//     // Find wallet by ownerId
//     const wallet = await Wallet.findOne({ ownerId: walletOwnerId });
//     if (!wallet) return res.status(404).json({ message: "Wallet not found" });

//     // Find transaction
//     const transaction = wallet.transactions.id(transactionId);
//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     // Update status to rejected
//     transaction.status = "rejected";
//     await wallet.save();

//     res.json({ success: true, message: "Settlement request rejected", transaction });
//   } catch (err) {
//     console.error("Error in rejectSettlement:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const rejectSettlement = async (req, res) => {
  try {
    const { walletOwnerId, transactionId } = req.body;

    if (!walletOwnerId || !transactionId) {
      return res.status(400).json({ message: "walletOwnerId and transactionId are required" });
    }

    // 🔎 Try finding wallet across multiple possible ID fields
    const wallet = await Wallet.findOne({
      $or: [
        { ownerId: walletOwnerId },      // for teacher/university wallets
        { teacherId: walletOwnerId },    // in case teacherId is stored separately
        { universityId: walletOwnerId }, // for university wallets
        { referralId: walletOwnerId },   // for referral wallets
        { _id: walletOwnerId },          // fallback: wallet’s own _id
      ],
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // ✅ Find transaction inside wallet
    const transaction = wallet.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ✅ Update status
    transaction.status = "rejected";
    await wallet.save();

    res.json({
      success: true,
      message: "Settlement request rejected",
      transaction,
    });
  } catch (err) {
    console.error("Error in rejectSettlement:", err);
    res.status(500).json({ message: err.message });
  }
};

 
