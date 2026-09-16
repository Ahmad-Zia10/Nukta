import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {Button, Input, Logo} from './index'
import { login  } from "../store/authSlice";
import { useSignupMutation } from '../store/apiSlice';
import { useDispatch } from "react-redux";
import {useForm} from 'react-hook-form';

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [signupUser, { isLoading }] = useSignupMutation();

    const signup = async(data) => {
        setError("");
        try {
            // Signup mutation returns { user }; the JWT arrives as an httpOnly cookie
            const result = await signupUser(data).unwrap();

            if(result?.user) {
                dispatch(login(result.user));
                navigate("/");
            }
        } catch (err) {
            // RTK Query surfaces the server payload on `data`; `error` holds
            // transport-level failures (network down, CORS).
            setError(err?.data?.message || err?.error || err?.message || 'Signup failed');
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(signup)}>
                    <div className='space-y-5'>
                        <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        error={errors.name?.message}
                        {...register("name", {
                            required: "Full name is required",
                        })}
                        />
                        <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        />
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </div>

    </div>
    )
}

export default SignUp