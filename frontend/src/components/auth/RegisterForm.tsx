import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { ReCaptcha } from '../common/ReCaptcha';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA');
      return;
    }

    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      await authAPI.register({
        ...registerData,
        captchaToken
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            label="First Name"
            {...register('firstname', { required: 'First name is required' })}
            error={errors.firstname?.message}
          />
          <Input
            label="Last Name"
            {...register('lastname', { required: 'Last name is required' })}
            error={errors.lastname?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />

          <div className="flex justify-center">
            <ReCaptcha onVerify={setCaptchaToken} />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            disabled={isLoading || !captchaToken}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;