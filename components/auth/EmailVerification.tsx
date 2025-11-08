"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/auth";

interface EmailVerificationProps {
  email: string;
}

export default function EmailVerification({ email }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail();
      toast.success("Email de verificación reenviado");
    } catch (error: any) {
      toast.error(error.message || "Error al reenviar el email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-[#A8B89F]/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-[#A8B89F]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main message */}
      <div className="space-y-3">
        <h2 className="font-serif text-4xl font-medium text-nook-brown tracking-tight">
          Check your inbox
        </h2>
        <p className="font-sans text-lg text-nook-brown max-w-md mx-auto">
          We've sent a verification link to{" "}
          <span className="font-semibold text-brand-forest">{email}</span>.
        </p>
        <p className="font-sans text-lg text-nook-brown max-w-md mx-auto">
          Click the link to activate your nook.
        </p>
        <p className="font-sans text-base text-brand-forest font-medium max-w-md mx-auto pt-2">
          After verifying, return to the{" "}
          <a href="/login" className="underline hover:text-nook-green-dark transition-colors">
            login page
          </a>{" "}
          to access your account.
        </p>
      </div>

      {/* Resend button */}
      <button
        onClick={handleResend}
        disabled={isResending}
        className="font-sans text-base font-semibold text-brand-forest hover:text-nook-green-dark transition-colors border-2 border-brand-forest hover:border-nook-green-dark rounded-xl py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isResending ? "Sending..." : "Resend email"}
      </button>

      {/* Help text */}
      <p className="font-sans text-sm text-nook-brown/60 max-w-sm mx-auto">
        Didn't receive it? Check your spam folder.
      </p>
    </div>
  );
}

