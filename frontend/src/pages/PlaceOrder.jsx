import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";

// Validation Schema
const schema = yup.object().shape({
  firstName: yup.string().matches(/^[A-Za-z]+$/, "First name should only contain letters").min(2).required(),
  lastName: yup.string().matches(/^[A-Za-z]+$/, "Last name should only contain letters").min(2).required(),
  email: yup.string().email("Invalid email format").required(),
  street: yup.string().min(5, "Please enter a valid street address").required(),
  city: yup.string().matches(/^[A-Za-z\s]+$/, "City should only contain letters").required(),
  state: yup.string().matches(/^[A-Za-z\s]+$/, "State should only contain letters").required(),
  phone: yup.string().matches(/^\d{10}$/, "Phone number should be exactly 10 digits").required(),
});

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const orderId = uuidv4();
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, clearCart} = useContext(ShopContext);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      phone: '',
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (formData) => {
    setIsLoading(true);

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        order_id: orderId,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      if (method === 'cod') {
        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
        if (response.data.success) {
          toast.success("Order placed successfully!", { position: "top-right" });
          await clearCart()
          navigate('/orders');
        } else {
          toast.error(response.data.message, { position: "top-right" });
        }
      } else if (method === 'esewa') {
        const response = await axios.post(backendUrl + '/api/esewa/payment-initiate', orderData, { headers: { token } });
        if (response.status === 200) {
          await clearCart()
          toast.success("Redirecting to eSewa payment...", { position: "top-right" });
          window.location.href = response.data.url;
        } else {
          toast.error("Error initiating eSewa payment.", { position: "top-right" });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <div className='flex flex-col w-full'>
            <input {...register('firstName')} placeholder='First name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            {errors.firstName && <p className='text-red-500 text-xs mt-1'>{errors.firstName.message}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <input {...register('lastName')} placeholder='Last name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName.message}</p>}
          </div>
        </div>
        <div className='flex flex-col'>
          <input {...register('email')} type="email" placeholder='Email address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>
        <div className='flex flex-col'>
          <input {...register('street')} placeholder='Street address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          {errors.street && <p className='text-red-500 text-xs mt-1'>{errors.street.message}</p>}
        </div>
        <div className='flex gap-3'>
          <div className='flex flex-col w-full'>
            <input {...register('city')} placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city.message}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <input {...register('state')} placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            {errors.state && <p className='text-red-500 text-xs mt-1'>{errors.state.message}</p>}
          </div>
        </div>
        <div className='flex flex-col'>
          <input {...register('phone')} placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div
              onClick={() => setMethod('esewa')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'esewa' ? 'border-green-500' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setMethod('esewa'); }}
              aria-pressed={method === 'esewa'}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'esewa' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.esewa_icon} alt="esewa_logo" />
            </div>
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-500' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setMethod('cod'); }}
              aria-pressed={method === 'cod'}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              className='bg-black text-white px-16 py-3 text-sm disabled:bg-gray-500 disabled:cursor-not-allowed'
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
