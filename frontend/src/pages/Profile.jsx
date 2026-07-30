import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Edit3, Camera, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from '../assets/userLogo.png';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import MyOrder from "@/components/MyOrder";

function Profile() {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;

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

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setFile(null);
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response?.data);
      
      const errorMsg = error.response?.data?.message || "Failed to update Profile...";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your account and view your orders</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-auto p-1 rounded-md">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 py-3 px-4 sm:px-6 text-sm sm:text-base data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 py-3 px-4 sm:px-6 text-sm sm:text-base data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              <Package className="w-4 h-4" />
              My Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 sm:mt-8">
            <Card className="shadow-sm border border-gray-200 bg-gray-50">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Update Profile</CardTitle>
                <CardDescription>Keep your information up to date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-4 sm:px-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={updateUser.profilePic || userLogo}
                      alt="Profile Picture"
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-3 border-gray-900 shadow-md"
                    />
                    
                  </div>

                  <Label className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium cursor-pointer active:scale-95 transition-transform">
                   
                    <Camera className="w-4 h-4"/>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">First Name</Label>
                    <input
                      type="text"
                      name="firstName"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                    <input
                      type="text"
                      name="lastName"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <input
                      type="email"
                      name="email"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      disabled
                      value={updateUser.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <input
                      type="tel"
                      name="phoneNo"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Address</Label>
                    <input
                      type="text"
                      name="address"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">City</Label>
                    <input
                      type="text"
                      name="city"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Zip Code</Label>
                    <input
                      type="text"
                      name="zipCode"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-950 text-base"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-gray-900 hover:bg-blue-700 cursor-pointer text-white px-8 py-3 rounded-md font-medium transition-all active:scale-95 disabled:opacity-70 text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 sm:mt-8">
            {/* <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>
                  View and track all your past and current orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 sm:py-16 text-gray-500">
                  <Package className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="mt-2 text-sm sm:text-base">When you make a purchase, your orders will appear here.</p>
                </div>
              </CardContent>
            </Card> */}

            <MyOrder/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;