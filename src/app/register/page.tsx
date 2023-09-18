'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import './Page.module.css';
import { UserRegister } from '../../services/user.services';
import {
  RegisterErrors,
  RegisterFormData,
} from '../../interfaces/user.interface';

export default function Register() {
  const router = useRouter();
  const { loading, callEndpoint } = useFetchAndLoad();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          password:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long',
        });
      } else {
        setErrors({
          ...errors,
          password: '',
        });
      }
    } else if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match',
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: '',
        });
      }
    } else if (name === 'email') {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userForm = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      };

      const res = await callEndpoint(UserRegister(userForm));

      if (res) {
        toast.success('Registration successful!', {
          position: 'top-center',
          className: 'custom-toast-success',
        });

        router.push('/');
      }
    } catch (e) {
      toast.error('Registration failed. Please try again later.', {
        position: 'top-center',
        className: 'custom-toast',
      });
    }
  };

  return (
    <div className='flex h-[94.4vh] items-center justify-center bg-[#131313] py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-white'>Register</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              id='name'
              label='Name'
              name='name'
              autoComplete='name'
              autoFocus
              error={!!errors.name}
              helperText={errors.name}
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              id='lastname'
              label='Last Name'
              name='lastname'
              autoComplete='lastname'
              error={!!errors.lastname}
              helperText={errors.lastname}
              onChange={handleChange}
              value={formData.lastname}
            />
          </div>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
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
              autoComplete='new-password'
              error={!!errors.password}
              helperText={errors.password}
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div>
            <TextField
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              id='confirmPassword'
              autoComplete='new-password'
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              type='submit'
              className='btn btn-outline mr-3 w-36 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
