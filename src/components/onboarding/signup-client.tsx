"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function SignupClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Password validation states
  const [validations, setValidations] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update password validations if the password field changes
    if (name === 'password') {
      setValidations({
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasMinLength: value.length >= 10
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically call your registration API
      // For this example, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful registration, sign in the user
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      if (result?.error) {
        console.error("Sign in failed:", result.error);
        setIsLoading(false);
      } else {
        // Redirect to the next step of onboarding
        router.push("/onboarding/overview");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/onboarding/overview" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto min-h-[1024px] flex flex-col">
        <main className="flex flex-1 h-full">
          {/* Left Side - Registration Form */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col relative">
            <div className="mb-10">
              <div className="flex items-center">
                <Link href="/" className="text-blue-700 font-bold text-2xl flex items-center">
                  <span>SEO Scientist</span>
                </Link>
              </div>
            </div>

            <div className="absolute top-6 md:top-12 right-6 md:right-12">
              <span className="text-gray-600 text-sm">
                Already have an account? <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign In</Link>
              </span>
            </div>

            <div className="mt-8 md:mt-16 max-w-md mx-auto md:mx-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Start Your 14-Day Free Trial!</h1>
              <p className="text-gray-600 mb-8">Fully featured. No credit card required.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="flex-1 border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 rounded-md"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16" className="mr-2">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Sign up with Google
                </Button>
                
                <Link href="#" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full flex-1 border border-gray-300 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-2">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                    </svg>
                    Sign up with Facebook
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 my-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pr-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Check className={`h-3 w-3 mr-1 ${validations.hasLowercase ? 'text-green-500' : 'text-gray-400'}`} />
                      one lowercase character
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Check className={`h-3 w-3 mr-1 ${validations.hasUppercase ? 'text-green-500' : 'text-gray-400'}`} />
                      one uppercase character
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Check className={`h-3 w-3 mr-1 ${validations.hasNumber ? 'text-green-500' : 'text-gray-400'}`} />
                      one number
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Check className={`h-3 w-3 mr-1 ${validations.hasMinLength ? 'text-green-500' : 'text-gray-400'}`} />
                      10 characters minimum
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md whitespace-nowrap cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign up free"}
                </Button>
                
                <div className="text-xs text-gray-600 mt-4">
                  By registering you acknowledge that you accept the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">Terms and Conditions</Link> and have no reservations.
                </div>
              </form>
            </div>
            
            <div className="hidden md:block absolute bottom-0 left-0">
              <div className="w-24 h-24 bg-orange-400 rounded-tr-full opacity-70"></div>
            </div>
          </div>
          
          {/* Right Side - Testimonial */}
          <div className="hidden md:flex w-1/2 bg-blue-700 text-white p-12 flex-col justify-between relative overflow-hidden">
            <div className="max-w-md z-10">
              <h2 className="text-2xl font-light mb-6">
                "The tools and features that SEO Scientist offers are great for anyone looking to improve their search engine rankings and drive more organic traffic."
              </h2>
              
              <div className="flex flex-col items-end mt-8">
                <div className="relative w-full max-w-lg">
                  <img
                    src="/images/testimonial-profile.jpg"
                    alt="Marketing Expert"
                    className="w-full h-[400px] rounded-xl object-cover object-top shadow-xl"
                  />
                  <div className="absolute bottom-6 left-6 bg-blue-800/90 p-4 rounded-lg backdrop-blur-sm">
                    <p className="font-bold text-xl">Alex Morgan</p>
                    <p className="text-blue-200">Digital Marketing Director</p>
                    <p className="text-blue-200 text-sm mt-1">alexmorgan.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 z-10">
              <p className="text-blue-200 mb-4 text-sm font-medium">Trusted by leading companies worldwide</p>
              <div className="grid grid-cols-4 gap-8 items-center">
                {/* Using SVG directly instead of FontAwesome */}
                <div className="flex items-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 12.151l1.286.749c.431.252.431.732 0 .984l-5.858 3.421-3.031-1.767v-7.075l3.031-1.75 5.858 3.421-1.286.749-4.644-2.708v5.229l4.644-2.708z"/>
                  </svg>
                  <span className="ml-2 font-semibold">Google</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
                  </svg>
                  <span className="ml-2 font-semibold">Microsoft</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.594-1.122-.839-1.774-.839-1.204 0-2.272.62-2.533 1.897-.054.285-.261.567-.545.582l-3.048-.333c-.256-.056-.54-.266-.469-.66.701-3.698 4.046-4.817 7.037-4.817 1.529 0 3.526.41 4.729 1.574 1.527 1.437 1.38 3.352 1.38 5.43v4.916c0 1.477.616 2.125 1.195 2.925.205.28.251.612-.01.819l-2.391 2.083v-.001zm3.559-15.361c-.835-.386-1.797-.724-2.656-.848-1.339-.194-2.304.243-2.304 1.371 0 .621.5 1.063 1.076 1.213.917.243 2.156.292 3.046.63.021-.878.235-1.893.838-2.366z"/>
                  </svg>
                  <span className="ml-2 font-semibold">Amazon</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.672 15.226l-2.432.811.937 2.184 1.495-.637c.326-.137.571-.379.709-.697.138-.34.148-.735.01-1.076-.139-.34-.389-.596-.729-.734zm-20.914 6.774c-.066 0-.133-.003-.199-.01-.76-.038-1.405-.556-1.556-1.267-.046-.218-.053-.449-.02-.672l3.307-22.765c.154-.99 1.089-1.667 2.078-1.513.989.154 1.667 1.089 1.513 2.078l-3.709 18.828c.146.171.25.375.303.597.02.66.032.139.032.211 0 .313-.129.615-.355.842-.224.225-.523.353-.833.354h-.561v.317zm11.56-16c-2.177 0-4.154.813-5.662 2.148-.42.38-.769.819-1.056 1.29l-1.211 8.927c.344.442.738.85 1.179 1.215 1.508 1.333 3.485 2.146 5.663 2.146 4.632 0 8.395-3.763 8.395-8.395s-3.763-8.395-8.395-8.395h-.001c.001.063.013-.438-.012-.063z"/>
                  </svg>
                  <span className="ml-2 font-semibold">Slack</span>
                </div>
              </div>
            </div>
            
            <div className="absolute right-10 bottom-10">
              <div className="w-16 h-16 bg-orange-400 rounded-full opacity-70"></div>
            </div>
            <div className="absolute right-40 top-20">
              <div className="w-10 h-10 border-2 border-blue-500 transform rotate-45"></div>
            </div>
            <div className="absolute left-20 top-40">
              <div className="w-6 h-6 bg-blue-500 rounded-sm transform rotate-12"></div>
            </div>
            
            <img
              src="/images/abstract-bg.jpg"
              alt="Abstract Background"
              className="absolute opacity-5 bottom-0 right-0 w-full h-full object-cover"
            />
          </div>
        </main>
        
        <footer className="py-6 px-12 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} SEO Scientist. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 