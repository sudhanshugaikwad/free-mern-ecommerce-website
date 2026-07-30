import OrderCard from '@/components/OrderCard'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function ShowUserOrders() {
  const params = useParams()
  const [userOrder, setUserOrder] = useState([])   // ← fixed: null → []

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const { data } = await axios.get(             // ← fixed
      `${import.meta.env.VITE_API_URL}/api/v1/orders/user-order/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (data.success) {
      setUserOrder(data.orders);
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  // console.log(userOrder);

  return (
    <>
      <div className='pl-[280px]'>
        <OrderCard userOrder={userOrder} />
      </div>
      
    </>
  )
}

export default ShowUserOrders