"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 75) return "Moderate";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check if password is empty
    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    // Check password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check password strength
    if (passwordStrength < 75) {
      setError("Please create a stronger password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      //   const response= await resetPassword(,formData.password);
      //    if (response.status === 200) {
      //     setIsSubmitted(true);
      //     // Redirect to login page or show success message
      //   }
      setIsSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    {
      text: "At least one uppercase letter",
      met: /[A-Z]/.test(formData.password),
    },
    {
      text: "At least one lowercase letter",
      met: /[a-z]/.test(formData.password),
    },
    {
      text: "At least one number or special character",
      met: /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password),
    },
  ];

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Reset Password
          </CardTitle>
          <CardDescription className='text-center'>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className='bg-green-50 border-green-200'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-800'>
                Your password has been successfully reset. You can now log in
                with your new password.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>New Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {formData.password && (
                  <>
                    <div className='space-y-1 mt-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-xs'>
                          {getPasswordStrengthText()}
                        </span>
                        <span className='text-xs'>{passwordStrength}%</span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={getPasswordStrengthColor()}
                      />
                    </div>

                    <ul className='space-y-1 mt-2'>
                      {passwordRequirements.map((req, index) => (
                        <li key={index} className='flex items-center text-sm'>
                          {req.met ? (
                            <Check className='h-4 w-4 text-green-500 mr-2' />
                          ) : (
                            <X className='h-4 w-4 text-red-500 mr-2' />
                          )}
                          <span
                            className={
                              req.met ? "text-green-700" : "text-gray-600"
                            }
                          >
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter>
          {!isSubmitted && (
            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
