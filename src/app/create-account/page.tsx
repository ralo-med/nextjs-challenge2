"use client";

import { useActionState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";
import { createAccount } from "./actions";
import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

interface FormState {
  fieldErrors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
  };
}

export default function CreateAccount() {
  const [state, action] = useActionState<FormState | null, FormData>(
    createAccount,
    null
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <FlameLogo className="mb-8 h-12 w-12" />

      <form action={action} className="flex w-full max-w-sm flex-col gap-3">
        <FormInput
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required={true}
          autoComplete="username"
          errors={state?.fieldErrors?.username ?? []}
          icon={<UserIcon />}
        />
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="nico@nomad.com"
          required={true}
          autoComplete="email"
          errors={state?.fieldErrors?.email ?? []}
          icon={<EnvelopeIcon />}
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="•••"
          required={true}
          autoComplete="new-password"
          errors={state?.fieldErrors?.password ?? []}
          icon={<LockClosedIcon />}
        />
        <FormInput
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="•••"
          required={true}
          autoComplete="new-password"
          errors={state?.fieldErrors?.confirm_password ?? []}
          icon={<LockClosedIcon />}
        />
        <FormBtn text="Create account" />
      </form>
    </div>
  );
}
