

import React from 'react'
import Breadcrums from '@/components/Breadcrums'
import ProductImg from '@/components/ProductImg'
import ProductDesc from '@/components/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function SingleProduct() {
    const params = useParams()
    const productId = params.id
    const {products} = useSelector((store)=>store.product)
    const product = products.find((item)=>item._id === productId)
  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrums product={product} />

        <div className="mt-8 lg:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* Product Images */}
            <div className="sticky top-24">
              <ProductImg images={product.productImg}/>
            </div>

            {/* Product Details */}
            <div>
              <ProductDesc product={product}/>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default SingleProduct