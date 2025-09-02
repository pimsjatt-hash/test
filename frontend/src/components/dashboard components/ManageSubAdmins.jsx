// src/components/ManageSubAdmins.jsx
import React, { useEffect, useState } from "react";
import {
  createManager,
  getUsersByRole,
  deleteUser,
  updateSubRole,
} from "../../api/api";

export default function ManageSubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    password: "",
    subAdminRole: "blog_manager",
  });

  const [editingUserId, setEditingUserId] = useState(null);
  const [tempRole, setTempRole] = useState("");

  const subAdminRoles = [
    "blog_manager",
    "finance_manager",
    "governance",
    "role_manager",
    "sub_admin",
  ];

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const res = await getUsersByRole("sub-admin");
      setSubAdmins(res.data.data || []);
    } catch (error) {
      console.error("Error fetching sub-admins", error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createManager(newManager);
      setSubAdmins([...subAdmins, res.data.user]);
      setNewManager({
        name: "",
        email: "",
        password: "",
        subAdminRole: "blog_manager",
      });
    } catch (error) {
      console.error("Error creating manager", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin?"))
      return;
    try {
      await deleteUser(id);
      setSubAdmins(subAdmins.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleSaveRole = async (id) => {
    try {
      const res = await updateSubRole(id, tempRole);
      setSubAdmins(
        subAdmins.map((user) =>
          user._id === id
            ? { ...user, subAdminRole: res.data.subAdminRole }
            : user
        )
      );
      setEditingUserId(null);
      setTempRole("");
    } catch (error) {
      console.error("Error updating subAdminRole", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Sub-Admins
      </h2>

      {/* Full-width Create Form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 p-6 bg-white shadow-xl rounded-xl w-full flex flex-wrap gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 flex-1 min-w-[200px] rounded-md shadow-sm"
          value={newManager.name}
          onChange={(e) =>
            setNewManager({ ...newManager, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 flex-1 min-w-[200px] rounded-md shadow-sm"
          value={newManager.email}
          onChange={(e) =>
            setNewManager({ ...newManager, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 flex-1 min-w-[200px] rounded-md shadow-sm"
          value={newManager.password}
          onChange={(e) =>
            setNewManager({ ...newManager, password: e.target.value })
          }
          required
        />
        <select
          className="border p-2 flex-1 min-w-[150px] rounded-md shadow-sm"
          value={newManager.subAdminRole}
          onChange={(e) =>
            setNewManager({ ...newManager, subAdminRole: e.target.value })
          }
        >
          {subAdminRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md shadow-md"
        >
          Create Manager
        </button>
      </form>

      {/* Full-width Sub-Admins List */}
      {loading ? (
        <p>Loading sub-admins...</p>
      ) : (
        <div className="space-y-4">
          {subAdmins.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition"
            >
              {/* Avatar + Details */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-lg font-bold text-blue-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-800">
                    {user.name}
                  </h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Role Section */}
              <div className="flex-1 flex justify-center">
                {editingUserId === user._id ? (
                  <div className="flex gap-2">
                    <select
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value)}
                      className="border p-2 rounded-md shadow-sm"
                    >
                      {subAdminRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow-md"
                      onClick={() => handleSaveRole(user._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md shadow-md"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-md">
                    <span className="font-medium text-gray-700">
                      {user.subAdminRole}
                    </span>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow-md"
                      onClick={() => {
                        setEditingUserId(user._id);
                        setTempRole(user.subAdminRole);
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
