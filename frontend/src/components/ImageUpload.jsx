// import React from 'react'
// import { Label } from './ui/label'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { Card, CardContent } from './ui/card'
// import { X } from 'lucide-react'

// function ImageUpload({ productData, setProductData }) {
//     const handeleFiles = (e) => {
//         const files = Array.from(e.target.files || [])

//         if (files.length) {
//             setProductData((prev) => ({
//                 ...prev,
//                 productImg: [...prev.productImg, ...files]
//             }))
//         }
//     }

//     return (
//         <div className="grid gap-3">
//             <Label>Product Images</Label>

//             <Input
//                 type="file"
//                 id="file-upload"
//                 className="hidden"
//                 accept="image/*"
//                 multiple
//                 onChange={handeleFiles}
//             />

//             <Button variant="outline" className="w-full sm:w-auto">
//                 <label htmlFor="file-upload" className="cursor-pointer w-full text-center">
//                     Upload Images
//                 </label>
//             </Button>

//             {/* Image Preview */}
//             {productData.productImg.length > 0 && (
//                 <div className="mt-4">
//                     <p className="text-sm text-gray-500 mb-3">Selected Images ({productData.productImg.length})</p>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {productData.productImg.map((file, idex) => {
//                             // check if file is alredy a file fom input or db objective/string
//                             let preview
//                             if (file instanceof File) {
//                                 preview = URL.createObjectURL(file)
//                             } else if (typeof file === 'string') {
//                                 preview = file
//                             } else if (file?.url) {
//                                 preview = file.url
//                             } else {
//                                 return null;
//                             }

//                             return (
//                                 <Card key={idex} className="relative group overflow-hidden">
//                                     <CardContent className="p-2">
//                                         <img
//                                             src={preview}
//                                             alt=""
//                                             className="w-full h-32 sm:h-36 object-cover rounded-md"
//                                         />
//                                         {/* remove button */}
//                                         <button>
//                                             <X
//                                                 className="cursor-pointer absolute top-3 right-3 text-white bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
//                                                 size={18}
//                                             />
//                                         </button>
//                                     </CardContent>
//                                 </Card>
//                             )
//                         })}
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ImageUpload

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

function ImageUpload({ productData, setProductData }) {
  const handeleFiles = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      setProductData((prev) => {
        const currentImages = prev.productImg || [];
        const totalImages = currentImages.length + files.length;

        // Limit to maximum 5 images
        if (totalImages > 5) {
          alert("You can upload maximum 5 images only!");
          return prev; // Don't add if exceeds limit
        }

        return {
          ...prev,
          productImg: [...currentImages, ...files],
        };
      });
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => {
      const updatedImages = prev.productImg.filter((_, i) => i !== index);
      return {
        ...prev,
        productImg:updatedImages,
      };
    });
  };

  return (
    <div className="grid gap-3">
      <Label>Product Images (Max 5)</Label>

      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handeleFiles}
      />

      <Button variant="outline" className="w-full sm:w-auto">
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full text-center"
        >
          Upload Images
        </label>
      </Button>

      {/* Image Preview Grid - Responsive */}
      {productData?.productImg?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-3">
            {productData.productImg.length} / 5 images selected
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {productData.productImg.map((file, index) => {
              let preview;
              if (file instanceof File) {
                preview = URL.createObjectURL(file);
              } else if (typeof file === "string") {
                preview = file;
              } else if (file?.url) {
                preview = file.url;
              } else {
                return null;
              }

              return (
                <Card key={index} className="relative group overflow-hidden">
                  <CardContent className="p-2">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={()=>removeImage(index)}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
