"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  xUsername: string;
  followersCount: number;
  goblinPoints: number;
  profileImage?: string;
}

const AdminTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/users`);
        setUsers(res.data.rankedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handlePointChange = (_id: string, newPoints: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === _id ? { ...user, goblinPoints: newPoints } : user
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/update-points", {
        users: users.map(({ _id, goblinPoints }) => ({ _id, goblinPoints })),
      });
      alert("Successfully updated goblin points!");
    } catch (error) {
      console.error("Failed to update users", error);
      alert("Something went wrong while saving.");
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Admin Dashboard – Weekly Goblin Points
      </h2>
      <table className="w-full border-collapse text-sm bg-gray-900 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">No.</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Followers</th>
            <th className="p-3 text-left">Goblin Points</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id} className="border-b border-gray-800">
              <td className="p-3 text-gray-400">#{index + 1}</td>{" "}
              {/* ✅ Row number */}
              <td className="p-3">{user.xUsername}</td>
              <td className="p-3">{user.followersCount}</td>
              <td className="p-3">
                <input
                  type="number"
                  value={user.goblinPoints}
                  onChange={(e) =>
                    handlePointChange(user._id, parseInt(e.target.value, 10))
                  }
                  className="bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded w-24"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-5 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold disabled:opacity-50 ">
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminTable;
