"use client";

import type React from "react";

import {
  useState,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyEmail } from "@/util/api";
import { useRouter } from "next/navigation";

export default function OTPInput() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  // Check if OTP is complete
  useEffect(() => {
    const isOtpComplete = otp.every((digit) => digit !== "");
    setIsComplete(isOtpComplete);
  }, [otp]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow one digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move to next input on right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  // Handle verification
  const handleVerify = async () => {
    const otpValue = otp.join("");
    const response = await verifyEmail(otpValue);
    if (response.status === 200) {
      alert("Verification successfuly");
      router.push("/login");
    }
    // Here you would typically call your verification API
    alert(`OTP ${otpValue} submitted for verification`);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Verification Code
          </CardTitle>
          <CardDescription className='text-center'>
            We have sent a verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center gap-2 mb-6'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Input
                key={index}
                type='text'
                inputMode='numeric'
                maxLength={1}
                ref={(el: HTMLInputElement | null): void => {
                  inputRefs.current[index] = el;
                }}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className='w-12 h-12 text-center text-xl font-bold'
                autoFocus={index === 0}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            disabled={!isComplete}
            onClick={handleVerify}
          >
            Verify
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
