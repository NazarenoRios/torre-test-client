'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import './Page.module.css';
import { UserSignIn } from '../../services/user.services';
import { SignInErrors, SignInFormData } from '../../interfaces/user.interface';

export default function SignIn() {
  const router = useRouter();
  const { loading, callEndpoint } = useFetchAndLoad();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<SignInErrors>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: 'Invalid email address',
        });
      } else {
        setErrors({
          ...errors,
          email: '',
        });
      }
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userForm = {
        email: formData.email,
        password: formData.password,
      };

      const res = await callEndpoint(UserSignIn(userForm));

      if (res) {
        localStorage.setItem('token', res.data.user.token);
        localStorage.setItem('UID', res.data.user.id);

        toast.success('Login successful!', {
          position: 'top-center',
          className: 'custom-toast-success',
        });

        router.push('/?logged=true');
      }
    } catch (e) {
      toast.error(
        'Login failed. Please check your credentials and try again.',
        {
          position: 'top-center',
          className: 'custom-toast',
        }
      );
    }
  };

  return (
    <div className='flex h-[94.4vh] items-center justify-center bg-[#131313] py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-white'>Login</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              error={!!errors.email}
              helperText={errors.email}
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              error={!!errors.password}
              helperText={errors.password}
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              type='submit'
              className='btn btn-outline mr-3 w-36 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
