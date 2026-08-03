import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { setProducts } from "@/redux/productSlice";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AdminProduct() {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

const handleChange = (e) => {
  const { name, value } = e.target;
  setEditProduct((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSave = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("productName", editProduct.productName);
  formData.append("productDesc", editProduct.productDesc);
  formData.append("productPrice", editProduct.productPrice);
  formData.append("category", editProduct.category);
  formData.append("brand", editProduct.brand);

  // add existing images public_id
  const existingImages = editProduct.productImg
    ?.filter((img) => !(img instanceof File) && img.public_id)
    .map((img) => img.public_id);

  formData.append("existingImages", JSON.stringify(existingImages || []));

  // add new files
  editProduct.productImg
    ?.filter((img) => img instanceof File)
    .forEach((file) => {
      formData.append("files", file);
    });

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/v1/product/update/${editProduct._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (res.data.success) {
      toast.success("Product Updated Successfully..!");
      const updateProducts = products.map((p) =>
        p._id === editProduct._id ? res.data.product : p,
      );
      dispatch(setProducts(updateProducts));
      setOpen(false);
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to update product");
  }
};

const deleteProductHandler = async (productId) => {
  try {
    const remainingProducts = products.filter(
      (product) => product._id !== productId,
    );

    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/v1/product/delete/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(setProducts(remainingProducts));
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete product");
  }
};

const filteredProducts = products?.filter((product) => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) return true; // show all when search is empty

  const name = product.productName?.toLowerCase() || "";
  const brand = product.brand?.toLowerCase() || "";
  const category = product.category?.toLowerCase() || "";

  return (
    name.includes(term) ||
    brand.includes(term) ||
    category.includes(term)
  );
}) || [];

const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
  if (sortBy === "lowToHigh") {
    return a.productPrice - b.productPrice;
  }
  if (sortBy === "highToLow") {
    return b.productPrice - a.productPrice;
  }
  return 0; // no sorting
});

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Product..."
              className="w-full pr-10 bg-white"
            />
            <Search 
             className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white shrink-0">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {sortedProducts?.map((product) => (
            <Card
              key={product._id || product.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Image + Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={product.productImg?.[0]?.url}
                    alt={product.productName}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shrink-0 bg-gray-100"
                  />
                  <h2 className="font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                </div>

                {/* Price + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                  <p className="font-semibold text-gray-900 whitespace-nowrap">
                    ₹ {product.productPrice}
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Edit Dialog */}
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Edit
                          onClick={() => {
                            (setOpen(true), setEditProduct(product));
                          }}
                          className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                        />
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>
                            Make changes to the product here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                          <div className="grid gap-2">
                            <Label>Product Name</Label>
                            <Input
                              name="productName"
                              value={editProduct?.productName}
                              onChange={handleChange}
                              placeholder="ex.iPhone"
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label>Price (₹)</Label>
                            <Input
                              name="productPrice"
                              value={editProduct?.productPrice}
                              onChange={handleChange}
                              type="number"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Brand</Label>
                              <Input
                                name="brand"
                                value={editProduct?.brand}
                                onChange={handleChange}
                                type="type"
                                placeholder="Ex.Apple"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Category</Label>
                              <Input
                                name="category"
                                value={editProduct?.category}
                                onChange={handleChange}
                                type="type"
                                placeholder="Ex.Mobile"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <div className="flex items-center-safe">
                              <Label>Discription</Label>
                            </div>
                            <Textarea
                              value={editProduct?.productDesc}
                              onChange={handleChange}
                              name="productDesc"
                              placeholder="Enter brif description of product"
                            />
                          </div>
                          <ImageUpload
                            productData={editProduct}
                            setProductData={setEditProduct}
                          />
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleSave} type="submit">
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}

                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="outline" />}>
                       <Trash2 className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600 transition-colors" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={()=>deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {sortedProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}

export default AdminProduct;
