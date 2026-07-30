import { Button, Input } from '@base-ui/react';
import React from 'react';
import { Label } from './ui/label';

function FilterSidebar({ search,setSearch, category,setCategory,brand,setBrand,allProducts, priceRange,setPriceRange }) {
    
    
    const Categories = allProducts.map(p => p.category);
    const UniqueCategory = ["All", ...new Set(Categories)];

    const Brands = allProducts.map(p => p.brand);
    const UniqueBrand = ["All", ...new Set(Brands)];
    // console.log(UniqueCategory);
    // console.log(UniqueBrand);

    const handleCategoryClick = (val)=>{
        setCategory(val)
    }

    const handleBranchChnage =(e)=>{
        setBrand(e.target.value)
    }
    const handleMinChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    if (value <= priceRange[1]) {
        setPriceRange([value, priceRange[1]]);
    }
};

const handleMaxChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    if (value >= priceRange[0]) {
        setPriceRange([priceRange[0], value]);
    }
};

    const resetFilters =()=>{
        setSearch('');
        setCategory("All");
        setBrand("All");
        setPriceRange([0,999999])
    }

    return (
        <div className='rounded-md w-full md:w-72 lg:w-80 bg-gray-100 border border-gray-300 p-4 md:p-5'>
            
            {/* search */}
            <Input
                type='text'
                placeholder='Search'
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="bg-white p-2 rounded-md border-2 focus:outline-none focus:border-gray-900 w-full"
            />

            {/* category */}
            <h1 className='mt-6 font-semibold text-xl'>Category</h1>
            <div className='flex flex-col gap-2 mt-3'>
                {UniqueCategory.map((item, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <Input type='radio' checked={category === item} onChange={()=>handleCategoryClick(item)} className='accent-gray-900 w-5 h-5 cursor-pointer' />
                        <Label htmlFor="">{item}</Label>
                    </div>
                ))}
            </div>

            {/* brand - Native Select Dropdown */}
            <h1 className='mt-6 font-semibold text-xl'>Brand</h1>
            <select
                className='bg-white w-full p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-gray-900 cursor-pointer'
                value={brand} onChange={handleBranchChnage}
            >
                {UniqueBrand.map((item, index) => (
                    <option key={index} value={item}>
                        {item.toUpperCase()}
                    </option>
                ))}
            </select>

            {/* Price Range */}
            <h1 className='mt-6 font-semibold text-xl'>Price Range</h1>
            <div className='flex flex-col gap-2'>
                <Label>
                    Price Range: ₹ {priceRange[0]}  - ₹ {priceRange[1]}
                </Label>
                <div className='flex flex-col sm:flex-row gap-2 items-center'>
                    <Input 
                        type="number" 
                        min='0' 
                        max='5000' 
                        value={priceRange[0]} 
                        onChange={handleMinChange}
                        className='w-full sm:w-20 border-2 border-gray-300 rounded' 
                    />
                    <span className='hidden sm:inline'>-</span>
                    <Input 
                        type="number" 
                        min='0' 
                        max='9999999' 
                         value={priceRange[1]} 
                        onChange={handleMaxChange}
                        className='w-full sm:w-20 border-2 border-gray-300 rounded' 
                    />
                </div>
                <Input type='range' min='0' max='5000' step="100" className='w-full accent-black cursor-pointer' value={priceRange[0]} onChange={handleMinChange}/>
                <Input type='range' min='0' max='9999999' step="100" className='w-full accent-black cursor-pointer' value={priceRange[1]} onChange={handleMaxChange}/>
            </div>

            {/* Reset Button */}
            <Button onClick={resetFilters} className='mt-6 w-full bg-black hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium transition-all active:scale-95 disabled:opacity-70 cursor-pointer'>
                Reset Filter
            </Button>

        </div>
    );
}

export default FilterSidebar;

