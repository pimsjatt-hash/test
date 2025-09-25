//  import Wallet from "../models/wallet.js";
// import Course from "../models/course.js";
// import User from "../models/user.js";
// import mongoose from "mongoose";
//  export const universityApproveSettlement = async (req, res) => {
//   try {
//     const { teacherId, transactionId, teacherShareApproved } = req.body;
//     const universityId = req.user.id;

//     // 1️⃣ Find teacher wallet
//     const teacherWallet = await Wallet.findOne({ teacherId });
//     if (!teacherWallet) return res.status(404).json({ message: "Teacher wallet not found" });

//     // 2️⃣ Find the teacher settlement request transaction
//     const teacherTransaction = teacherWallet.transactions.id(transactionId);
//     if (!teacherTransaction || teacherTransaction.status !== "pending_university") {
//       return res.status(400).json({ message: "Invalid or already processed transaction" });
//     }

//     // 3️⃣ Update teacher transaction as approved by university
//     teacherTransaction.status = "approved_by_university";
//     teacherTransaction.note = `Approved by University (${universityId}), pending Finance Manager`;
//     await teacherWallet.save();

//     // 4️⃣ Find or create university wallet
//     let universityWallet = await Wallet.findOne({ ownerId: universityId, ownerType: "university" });
//     if (!universityWallet) {
//       universityWallet = new Wallet({
//         ownerId: universityId,
//         ownerType: "university",
//         balance: 0,
//         transactions: [],
//       });
//     }

//     // 5️⃣ Create university transaction for Finance Manager approval
//     const amountForFinance = teacherShareApproved || teacherTransaction.amount;
//     universityWallet.transactions.push({
//       type: "settlement_request",
//       status: "pending",
//       amount: amountForFinance,
//       split: {
//         teacher: teacherShareApproved || 0, // will be sent to teacher after Finance Manager approval
//         university: 0, // university share will be applied dynamically
//         platform: 0,
//       },
//       note: `Settlement request from university for teacher ${teacherId}`,
//       teacherId, // track which teacher this is for
//       date: new Date(),
//       originalTeacherTransactionId: teacherTransaction._id,
//     });

//     universityWallet.balance += amountForFinance;
//     await universityWallet.save();

//     res.json({
//       success: true,
//       message: "University approved teacher request and created settlement for Finance Manager",
//       universityWallet,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ======================
// // Finance Manager credit
// // ======================
// export const creditWallet = async (req, res) => {
//   try {
//     const { ownerId, ownerType = "teacher", studentId, courseId, amount, note } = req.body;
//     let wallet;

//     if (ownerType === "teacher" || ownerType === "university") {
//       wallet = await Wallet.findOne({ teacherId: ownerId });
//     } else {
//       wallet = await Wallet.findOne({ ownerId, ownerType });
//     }

//     if (!wallet) wallet = new Wallet({ ownerId, ownerType, balance: 0, transactions: [] });

//     wallet.balance += amount;
//     wallet.transactions.push({ studentId, courseId, amount, type: "credit", note: note || "Manual credit" });
//     await wallet.save();

//     res.json({ success: true, message: `₹${amount} credited`, wallet });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ======================
// // Finance Manager debit
// // ======================
// export const debitWallet = async (req, res) => {
//   try {
//     const { ownerId, ownerType = "teacher", amount, note } = req.body;
//     let wallet;

//     if (ownerType === "teacher" || ownerType === "university") {
//       wallet = await Wallet.findOne({ teacherId: ownerId });
//     } else {
//       wallet = await Wallet.findOne({ ownerId, ownerType });
//     }

//     if (!wallet) return res.status(404).json({ message: "Wallet not found" });
//     if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

//     wallet.balance -= amount;
//     wallet.transactions.push({ type: "debit", amount, note: note || "Manual debit", date: new Date() });
//     await wallet.save();

//     res.json({ success: true, message: `₹${amount} debited`, wallet });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ======================
// // Get wallet details
// // ======================
 

// //  export const getWallet = async (req, res) => {
// //   try {
// //     const { ownerId } = req.params;
// //     const ownerType = req.query.ownerType || "teacher";

// //     // Validate ownerId as ObjectId (for all wallet types)
// //     if (!mongoose.Types.ObjectId.isValid(ownerId)) {
// //       return res.status(400).json({ message: "Invalid owner ID" });
// //     }

// //     let wallet;

// //     if (ownerType === "teacher" || ownerType === "university") {
// //       // Look for wallet by ownerId (not teacherId)
// //       wallet = await Wallet.findOne({ ownerId })
// //         .populate("transactions.studentId", "name email")
// //         .populate("transactions.courseId", "title price");
// //     } else {
// //       wallet = await Wallet.findOne({ ownerId, ownerType })
// //         .populate("transactions.studentId", "name email")
// //         .populate("transactions.courseId", "title price");
// //     }

// //     if (!wallet) return res.status(404).json({ message: "Wallet not found" });

// //     res.json(wallet);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// export const getWallet = async (req, res) => {
//   console.log("getWallet called");
  
//   try {
//     const { ownerId } = req.params;
//     const ownerType = req.query.ownerType || "teacher";
//     console.log(ownerId, "ownerId");
//     console.log(ownerType, "ownerType");
    

//     // ✅ Only validate ObjectId for teacher or university
//     if (["teacher", "university"].includes(ownerType) && !mongoose.Types.ObjectId.isValid(ownerId)) {
//       return res.status(400).json({ message: "Invalid owner ID" });
//     }

//     let wallet;

//     if (["teacher", "university"].includes(ownerType)) {
//       wallet = await Wallet.findOne({ ownerId, ownerType })
//         .populate("transactions.studentId", "name email")
//         .populate("transactions.courseId", "title price");
//     } else {
//       // Referral or other wallets: no ObjectId validation
//       wallet = await Wallet.findOne({ ownerId, ownerType })
//         .populate("transactions.studentId", "name email")
//         .populate("transactions.courseId", "title price");
//     }

//     if (!wallet) return res.status(404).json({ message: "Wallet not found" });
//     res.json(wallet);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

 

// ✅ Get wallet by owner

 

// ✅ University approves teacher request


import mongoose from "mongoose";
import Wallet from "../models/wallet.js";
import SettlementRequest from "../models/SettlementRequest.js"; // make sure you have this model
 

export const teacherRequestSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { teacherId, amount, affiliatedUniversity } = req.body;

    if (!teacherId || !amount) {
      return res.status(400).json({ success: false, message: "teacherId and amount are required" });
    }

    teacherId = new mongoose.Types.ObjectId(teacherId);
    const universityId = affiliatedUniversity ? new mongoose.Types.ObjectId(affiliatedUniversity) : null;

    // Find or create teacher wallet
    let teacherWallet = await Wallet.findOne({ ownerType: "teacher", ownerId: teacherId }).session(session);
    if (!teacherWallet) {
      teacherWallet = new Wallet({
        ownerType: "teacher",
        ownerId: teacherId,
        balance: 0,
        onHold: 0,
        transactions: [],
      });
      await teacherWallet.save({ session });
    }

    if (teacherWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Move funds to onHold
    teacherWallet.balance -= amount;
    teacherWallet.onHold += amount;

    // 1️⃣ Create settlement request first
    const [settlementRequest] = await SettlementRequest.create(
      [
        {
          sourceWalletId: teacherWallet._id,
          sourceOwnerType: "teacher",
          sourceOwnerId: teacherId,
          targetType: universityId ? "university" : "finance",
          targetId: universityId || null,
          amount,
          status: universityId ? "pending_university" : "pending_finance",
          createdBy: teacherId,
        },
      ],
      { session }
    );

    // 2️⃣ Add transaction to wallet including requestId
    teacherWallet.transactions.push({
      type: "debit",
      amount,
      status: universityId ? "pending_university" : "pending_finance",
      description: universityId
        ? `Settlement request to university ${universityId}`
        : "Settlement request to Finance Manager",
      metadata: {
        requestType: "settlement",
        targetUniversityId: universityId || null,
        requestId: settlementRequest._id, // ✅ important
      },
      createdAt: new Date(),
    });

    await teacherWallet.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: "Settlement request created", wallet: teacherWallet });
  } catch (err) {
    await session.abortTransaction();
    console.error("TeacherRequestSettlement Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const universityApproveSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.body;
    const universityId = req.user.id; // from JWT

    if (!requestId) throw new Error("requestId is required");

    // Find the settlement request
    const request = await SettlementRequest.findById(requestId).session(session);
    if (!request) throw new Error("Settlement request not found");

    // Only allow approval if pending university
    if (request.status !== "pending_university") {
      throw new Error("Invalid or already processed request");
    }

    // Find teacher wallet and check onHold
    const teacherWallet = await Wallet.findById(request.sourceWalletId).session(session);
    if (!teacherWallet || teacherWallet.onHold < request.amount) {
      throw new Error("Teacher wallet has insufficient onHold balance");
    }
    teacherWallet.onHold -= request.amount;

    // Update the transaction in teacher wallet
    const tx = teacherWallet.transactions.find(
      t => t.metadata?.requestId?.toString() === requestId.toString()
    );
    if (tx) tx.status = "approved_by_university";
    await teacherWallet.save({ session });

    // Find or create university wallet
    let universityWallet = await Wallet.findOne({ ownerType: "university", ownerId: universityId }).session(session);
    if (!universityWallet) {
      universityWallet = new Wallet({
        ownerType: "university",
        ownerId: universityId,
        balance: 0,
        onHold: 0,
        transactions: [],
      });
    }

    // Credit university wallet
    universityWallet.balance += request.amount;
    universityWallet.transactions.push({
      type: "credit",
      amount: request.amount,
      status: "approved_by_university",
      description: `Received settlement from teacher ${request.sourceOwnerId}`,
      metadata: { sourceTeacherId: request.sourceOwnerId, requestId },
      createdAt: new Date(),
    });
    await universityWallet.save({ session });

    // Update settlement request status
    request.status = "approved_by_university";
    request.approvedBy = universityId;
    request.approvedAt = new Date();
    await request.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: "Settlement approved by university", wallet: universityWallet });

  } catch (err) {
    await session.abortTransaction();
    console.error("UniversityApproveSettlement Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


// ✅ University requests settlement to finance
export const universityRequestSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const universityId = req.user.id;
    const { amount } = req.body;

    if (!amount) throw new Error("Amount is required");

    const uniWallet = await Wallet.findOne({ ownerType: "university", ownerId: universityId }).session(session);
    if (!uniWallet || uniWallet.balance < amount) {
      throw new Error("Insufficient funds");
    }

    uniWallet.balance -= amount;
    uniWallet.onHold += amount;
    uniWallet.transactions.push({
      type: "debit",
      amount,
      status: "pending_finance",
      description: "Settlement request to Finance Manager",
      metadata: { requestType: "settlement" },
      createdAt: new Date(),
    });
    await uniWallet.save({ session });

    await SettlementRequest.create([{
      sourceWalletId: uniWallet._id,
      sourceOwnerType: "university",
      sourceOwnerId: universityId,
      targetType: "finance",
      amount,
      status: "pending_finance",
      createdBy: universityId,
    }], { session });

    await session.commitTransaction();
    res.json({ message: "University settlement request sent to finance", wallet: uniWallet });

  } catch (err) {
    await session.abortTransaction();
    console.error("UniversityRequestSettlement Error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};


// ✅ Referral requests settlement
export const referralRequestSettlement = async (req, res) => {
  const { referralId, amount } = req.body;
  const referralWallet = await Wallet.findOne({ ownerType: "referral", ownerId: referralId });
  if (!referralWallet || referralWallet.balance < amount) {
    return res.status(400).json({ message: "Insufficient funds" });
  }

  referralWallet.balance -= amount;
  referralWallet.onHold += amount;
  await referralWallet.save();

  await SettlementRequest.create({
    sourceWalletId: referralWallet._id,
    sourceOwnerType: "referral",
    sourceOwnerId: referralId,
    targetType: "finance",
    amount,
    status: "pending_finance",
    createdBy: referralId,
  });

  res.json({ message: "Referral settlement request sent to finance" });
};

// ✅ Finance approves settlement with split logic
export const financeApproveSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { requestId, split } = req.body;

    // Find the settlement request
    const request = await SettlementRequest.findById(requestId).session(session);
    if (!request || !["approved_by_university", "pending_finance"].includes(request.status)) {
      throw new Error("Invalid request");
    }

    // Source wallet
    const wallet = await Wallet.findById(request.sourceWalletId).session(session);
    if (!wallet || wallet.onHold < request.amount) throw new Error("Funds not available");

    wallet.onHold -= request.amount;
    await wallet.save({ session });

    // Apply split to each recipient
    for (const [ownerType, { ownerId, percent }] of Object.entries(split)) {
      const share = (request.amount * percent) / 100;

      let w = await Wallet.findOneAndUpdate(
        { ownerType, ownerId },
        { $inc: { balance: share } },
        { upsert: true, new: true, session }
      );

      if (!w.transactions) w.transactions = [];

      w.transactions.push({
        amount: share,
        type: "credit",
        status: "approved",
        description: `Settlement split from request ${request._id}`,
        metadata: { split, requestId },
        createdAt: new Date(),
      });

      await w.save({ session });
    }

    // Update settlement request
    request.status = "approved";
    request.approvedAt = new Date();
    request.metadata = request.metadata || {};
    request.metadata.split = split;
    await request.save({ session });

    await session.commitTransaction();
    res.json({ message: "Settlement approved and split applied" });
  } catch (err) {
    await session.abortTransaction();
    console.error("FinanceApproveSettlement Error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};



export const getWallet = async (req, res) => {
  try {
    const { ownerType, ownerId } = req.params;
    const wallet = await Wallet.findOne({ ownerType, ownerId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const universityRejectSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.body;
    const universityId = req.user.id;

    if (!requestId) throw new Error("requestId is required");

    // Find the settlement request
    const request = await SettlementRequest.findById(requestId).session(session);
    if (!request) throw new Error("Settlement request not found");

    if (request.status !== "pending_university")
      throw new Error("Request already processed");

    // Find university wallet
    const universityWallet = await Wallet.findOne({
      ownerType: "university",
      ownerId: universityId,
    }).session(session);

    if (!universityWallet) throw new Error("University wallet not found");

    // Reverse the onHold amount
    universityWallet.onHold -= request.amount;

    // Update transaction status
    const tx = universityWallet.transactions.find(
      (t) => t.metadata?.requestId?.toString() === requestId.toString()
    );
    if (tx) tx.status = "rejected";

    await universityWallet.save({ session });

    // Update request status
    request.status = "rejected";
    request.approvedBy = universityId;
    request.approvedAt = new Date();
    await request.save({ session });

    await session.commitTransaction();
    res.json({ success: true, message: "Settlement request rejected", wallet: universityWallet });
  } catch (err) {
    await session.abortTransaction();
    console.error("UniversityRejectSettlement Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
