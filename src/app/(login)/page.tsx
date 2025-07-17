"use client";

import { useActionState } from "react";
import { handleForm } from "./actions";
import {
  FireIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import FormInput from "@/components/form-input";
import FormButton from "@/components/form-btn";

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

export default function LogIn() {
  const [state, action] = useActionState(handleForm, { errors: [] });

  const passwordErrors = state?.errors ?? [];
  const isSuccess = state?.success ?? false;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <FlameLogo className="mb-8 h-12 w-12" />

      <form action={action} className="flex w-full max-w-sm flex-col gap-3">
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="nico@nomad.com"
          required={true}
          autoComplete="email"
          errors={[]}
          icon={<EnvelopeIcon />}
        />

        <FormInput
          id="username"
          name="username"
          type="text"
          placeholder="nico"
          required={true}
          autoComplete="username"
          errors={[]}
          icon={<UserIcon />}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="•••"
          required={true}
          autoComplete="current-password"
          errors={passwordErrors}
          icon={<LockClosedIcon />}
        />

        <FormButton text="Log in" />
      </form>

      {isSuccess && (
        <div className="mt-4 w-full max-w-sm flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-black h-12">
          <CheckCircleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Welcome back!</span>
        </div>
      )}
    </div>
  );
}
