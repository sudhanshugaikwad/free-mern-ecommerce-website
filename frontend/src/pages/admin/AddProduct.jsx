import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import Products from "../Products";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function AddProduct() {
   const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const {products} = useSelector(store=>store.product)
   const navigate = useNavigate();
   
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    if (productData.productImg.length === 0) {
      toast.error("Plase select at list one image..!");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/add`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center sm:text-left">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Add New Product For eKart
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Fill in the product details below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid gap-6">
              {/* Product Name */}
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                  className="rounded"
                  type="text"
                  placeholder="Ex. iPhone 15 Pro"
                  required
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="productPrice">Price (₹)</Label>
                <Input
                  name="productPrice"
                  value={productData.productPrice}
                  onChange={handleChange}
                  className="rounded"
                  type="number"
                  placeholder="99999"
                  required
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    name="brand"
                    value={productData.brand}
                  onChange={handleChange}
                    className="rounded"
                    type="text"
                    placeholder="Ex. Apple"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="rounded"
                    type="text"
                    placeholder="Ex. Mobile, Laptop, iPad"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="productDesc">Description</Label>
                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                  className="rounded"
                  rows={5}
                  placeholder="Enter a brief description of the product..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="grid gap-2">
              
                <ImageUpload productData={productData} setProductData={setProductData} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-8">
            <Button
            disabled={loading}
            onClick={submitHandler}
              type="submit"
              className="w-full sm:w-auto min-w-[200px] py-6 text-base font-semibold bg-black hover:bg-gray-900 transition-all cursor-pointer"
            >
              {
                loading ? <span className="flex gap-1 items-center"><Loader2 className="animate-spin"/>Please wait</span> : 'Add Product'
              }
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AddProduct;
