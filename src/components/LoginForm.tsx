"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/sentinel-logo.svg"
              alt="Sentinel Logo"
              className="mx-auto w-auto h-24 object-contain mb-4"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/sentinel-typo.svg"
              alt="Sentinel"
              className="mx-auto w-auto h-12 object-contain"
            />
          </div>

          {state?.error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-400 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2.5 text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-400 mb-1"
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
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2.5 pr-16 text-white outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {pending ? (
                <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Contact your administrator to request an account
          </p>
        </div>
      </div>
    </div>
  );
}
