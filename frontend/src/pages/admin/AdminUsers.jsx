import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/userLogo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null); // for loading state
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    }
  };

  const filteredUsers = users?.filter((user) => {
    return (
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const deleteUserHandler = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(userId);

      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/user/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllUsers(); // refresh list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Register Users on eKart</p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
            placeholder="Search users..!"
          />
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers?.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user?.profilePic || UserLogo}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="rounded-full w-14 h-14 object-cover border border-gray-300 shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[90px] cursor-pointer"
                  onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 min-w-[90px] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  onClick={() => deleteUserHandler(user._id)}
                  disabled={deletingId === user._id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {deletingId === user._id ? "Deleting..." : "Delete"}
                </Button>

                <Button
                  size="sm"
                  className="flex-1 min-w-[90px] cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user?._id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Orders
                </Button>
              </div>
            </div>
          ))}
        </div>

        {(!filteredUsers || filteredUsers.length === 0) && (
          <div className="text-center py-12 text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;