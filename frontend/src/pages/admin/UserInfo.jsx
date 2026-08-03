import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "../../assets/userLogo.png";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice"; // make sure this path is correct

function UserInfo() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  // console.log("URL params →", params);
  const userId = params.userId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize with safe defaults
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: "",
  });

  // Sync with Redux user safely
  useEffect(() => {
    if (user) {
      setUpdateUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilePic: user.profilePic || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName || "");
      formData.append("lastName", updateUser.lastName || "");
      formData.append("phoneNo", updateUser.phoneNo || "");
      formData.append("address", updateUser.address || "");
      formData.append("city", updateUser.city || "");
      formData.append("zipCode", updateUser.zipCode || "");
      formData.append("role", updateUser.role || "");

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setFile(null);
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response?.data);

      const errorMsg =
        error.response?.data?.message || "Failed to update Profile...";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 ml-[280px]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-bold text-2xl text-gray-950">Update Profile</h1>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 sm:p-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={updateUser.profilePic || userLogo}
                alt="Profile Picture"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-300 shadow-md"
              />
            </div>

            <Label className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium cursor-pointer active:scale-95 transition-transform">
              <Camera className="w-4 h-4" />
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>

          {/* User form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          >
            <div>
              <Label className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <input
                type="text"
                name="firstName"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <input
                type="text"
                name="lastName"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-gray-50"
                disabled
                value={updateUser.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <input
                type="tel"
                name="phoneNo"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.phoneNo}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <input
                type="text"
                name="address"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">City</Label>
              <input
                type="text"
                name="city"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Zip Code
              </Label>
              <input
                type="text"
                name="zipCode"
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base bg-white"
                value={updateUser.zipCode}
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
              <Label className="text-sm font-medium text-gray-700">Role:</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setUpdateUser({ ...updateUser, role: value })
                }
                value={updateUser?.role}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
