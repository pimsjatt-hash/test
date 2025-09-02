import React, { useState, useEffect } from "react";
import { Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../../api/api"; // ✅ axios api.js

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Load coupons
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // 🔹 Add new coupon
  const addCoupon = async () => {
    if (!newCode || !newDiscount) return alert("Fill all fields!");
    try {
      await createCoupon({
        couponName: newCode,
        discountType: newDiscount.includes("%") ? "percentage" : "amount",
        discountValue: parseInt(newDiscount.replace("%", "")),
        status: "active",
      });
      setNewCode("");
      setNewDiscount("");
      fetchCoupons();
    } catch (error) {
      alert("Error creating coupon: " + error.response?.data?.message);
    }
  };

  // 🔹 Ask before delete
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // 🔹 Delete coupon
  const removeCoupon = async () => {
    try {
      await deleteCoupon(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  // 🔹 Toggle Active/Inactive
  const toggleCoupon = async (id, currentStatus) => {
    try {
      await updateCoupon(id, {
        status: currentStatus === "active" ? "inactive" : "active",
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Coupon Management</h2>

      {/* Create Coupon Form */}
      <div className="bg-white p-5 rounded-2xl shadow-lg border mb-6">
        <h3 className="font-semibold mb-3">Create New Coupon</h3>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Discount (e.g. 20% or 100)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={addCoupon}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 shadow-md"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div>
        <h3 className="font-semibold mb-3">Available Coupons</h3>
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available.</p>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex justify-between items-center bg-white rounded-2xl shadow-lg border p-4 hover:shadow-xl transition"
              >
                {/* Coupon Info */}
                <div>
                  <p className="font-bold text-lg">{coupon.couponName}</p>
                  <p className="text-sm text-gray-500">
                    {coupon.discountType === "percentage"
                      ? `Discount: ${coupon.discountValue}%`
                      : `Discount: ₹${coupon.discountValue}`}
                  </p>
                  <span
                    className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      coupon.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => toggleCoupon(coupon._id, coupon.status)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {coupon.status === "active" ? (
                      <ToggleRight size={36} />
                    ) : (
                      <ToggleLeft size={36} />
                    )}
                  </button>
                  <button
                    onClick={() => confirmDelete(coupon._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Delete Coupon</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={removeCoupon}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
