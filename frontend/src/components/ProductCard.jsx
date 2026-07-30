// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { ShoppingCart } from "lucide-react";
// import { Skeleton } from "./ui/skeleton";
// import axios from "axios";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setCart } from "@/redux/productSlice";

// function ProductCard({ product, loading }) {
//   const { productImg, productPrice, productName } = product;
//   const accessToken = localStorage.getItem('accessToken')
//   const dishpatch = useDispatch();
//   const navigate = useNavigate()

//   const [loadingCart, setLoadingCart] = useState(false)

  
//   const addToCart = async(productId) =>{
//     try {
//       const res = await axios.post(`http://localhost:8000/api/v1/cart/add`,{productId},{
//         headers:{
//           Authorization:`Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         toast.success("Product add to cart..!")
//         dishpatch(setCart(res.data.cart));
//       }
//     } catch (error) {
//       console.log(error)
//     }finally {
//     setLoadingCart(false);
//   }
//   }


//   return (
//     <div className="shadow-lg rounded-lg overflow-hidden h-max p-2">
//       <div className="w-full h-ful aspect-square overflow-hidden">
//         {loading ? (
//           <Skeleton className="w-fill h-full rounded-lg" />
//         ) : (
//           <img
//             src={productImg[0]?.url}
//             alt="image"
//             className="w-full h-full transition-transform duration-300 hover:scale-105"
//           />
//         )}
//       </div>
//       {loading ? (
//         <div className="px-2 space-y-2 my-2">
//           <Skeleton className="w-\[200px] h-4" />
//           <Skeleton className="w-\[100px] h-4" />
//           <Skeleton className="w-\[150px] h-8" />
//         </div>
//       ) : (
//         <div className="px-2 space-y-1">
//           <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
//           <h3 className="font-bold">₹ {productPrice}</h3>
//           <Button onClick={() => addToCart(product._id)} className="mb-3 w-full bg-gray-900 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-70 cursor-pointer">
//             <ShoppingCart /> {loadingCart ? "Adding..." : "Add To Cart"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductCard;





import React, { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";

function ProductCard({ product, loading }) {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [loadingCart, setLoadingCart] = useState(false)

  
  const addToCart = async(productId) =>{
    try {
      setLoadingCart(true);
      const res = await axios.post(`http://localhost:8000/api/v1/cart/add`,{productId},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success("Product add to cart..!")
        dispatch(setCart(res.data.cart));
        // just testing
        // console.log("",res.data.cart)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCart(false);
    }
  }


  return (
    <div className="shadow-md rounded-md overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidde">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            onClick={()=>navigate(`/products/${product._id}`)}
            src={productImg[0]?.url}
            alt="image"
            className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[150px] h-8" />
        </div>
      ) : (
        <div className="px-2 space-y-1">
          <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
          <h3 className="font-bold">₹ {productPrice}</h3>
          <Button 
            onClick={() => addToCart(product._id)} 
            disabled={loadingCart}
            className="mb-3 w-full bg-black hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <ShoppingCart /> {loadingCart ? "Adding..." : "Add To Cart"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;