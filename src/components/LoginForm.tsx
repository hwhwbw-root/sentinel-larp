"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { SensorNetworkGraphic } from "@/components/login/SensorNetworkGraphic";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/sentinel-logo.svg"
              alt="Sentinel Logo"
              className="w-10 h-10 object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/sentinel-typo.svg"
              alt="Sentinel"
              className="w-auto h-7 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500 mb-8">
            Sign in to monitor your devices
          </p>

          {state?.error && (
            <div className="mb-6 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-zinc-600"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-white border border-zinc-300 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-lg px-3 py-2.5 text-zinc-900 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-medium text-zinc-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="w-full bg-white border border-zinc-300 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-lg px-3 py-2.5 pr-10 text-zinc-900 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-foreground py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {pending ? (
                <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-400 text-sm">
            Contact your administrator to request an account
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <SensorNetworkGraphic />
      </div>
    </div>
  );
}
