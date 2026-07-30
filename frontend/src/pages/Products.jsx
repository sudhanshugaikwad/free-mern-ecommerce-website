

import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

function Products() {

const { products } = useSelector((store) => store.product); // Fixed selector
const [allProducts, setAllProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [search, setSearch] = useState('');
const [category, setCategory] = useState('All');
const [brand, setBrand] = useState('All');
const [priceRange, setPriceRange] = useState([0, 9999999]);
const [sortOrder, setSortOrder] = useState('')

const dispatch = useDispatch();   // Fixed typo

const getAllProducts = async () => {
    try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/getallproducts`);
        
        if (res.data.success) {
            const fetchedProducts = res.data.products;
            
            setAllProducts(fetchedProducts);
            dispatch(setProducts(fetchedProducts));   // Fixed action name
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
        setLoading(false);
    }
};

        useEffect(() => {
          if (allProducts.length === 0) return;

          let filtered = [...allProducts];

          if (search.trim() !== "") {
            filtered = filtered.filter((p) =>
              p.productName?.toLowerCase().includes(search.toLowerCase()),
            );
          }

        // if (!allProducts || allProducts.length === 0) {
        //         return [];                    // ← Return empty array instead of undefined
        //     }

        //     let filtered = [...allProducts];

        //     const searchTerm = search?.trim() || "";   // Safe handling

        //     if (searchTerm !== "") {
        //         filtered = filtered.filter((p) =>
        //             p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        //         );
        //     }

            // this is for category filter
          if (category !== "All") {
            filtered = filtered.filter(p=>p.category === category)
          }
          // this is for brand filter
          if (brand !== "All") {
            filtered = filtered.filter(p=>p.brand === brand)
          }
        //   this is fro filter low to high and high to low
          filtered = filtered.filter(p=>p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

          if (sortOrder === 'lowToHigh') {

            filtered.sort((a,b)=>a.productPrice - b.productPrice)
            
          } else if (sortOrder === 'highToLow') {
            filtered.sort((a,b)=>b.productPrice - a.productPrice )
          }

          dispatch(setProducts(filtered))


        },[search,category,brand,sortOrder,priceRange,allProducts,dispatch]);

        useEffect(() => {
            getAllProducts();
        }, []);

    return (
        <div className="pb-10 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Sidebar - Responsive */}
                    <div className="lg:w-72 xl:w-80 flex shrink-0">
                        <FilterSidebar 
                            search={search}
                            setSearch={setSearch}
                            brand={brand}
                            setBrand={setBrand}
                            category={category}
                            setCategory={setCategory}
                            allProducts={allProducts} 
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}

                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                                    All Products
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {allProducts.length} products
                                </p>
                            </div>

                            <Select onValueChange={(value)=>setSortOrder(value)} defaultValue="price-low">
                                <SelectTrigger className="w-full sm:w-65">
                                    <SelectValue placeholder="Sort by Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Sort By Price</SelectLabel>
                                        <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                                        <SelectItem value="highToLow">Price: High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Products Grid - Fully Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    loading={loading} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;