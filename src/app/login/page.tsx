"use client";

import { useActionState } from "react";
import { handleForm } from "./actions";
import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

interface FormState {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

export default function LogIn() {
  const [state, action] = useActionState<FormState | null, FormData>(
    handleForm,
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
          name="email"
          type="email"
          placeholder="nico@nomad.com"
          required
          errors={state?.fieldErrors?.email ?? []}
          icon={<EnvelopeIcon />}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="•••"
          required
          errors={state?.fieldErrors?.password ?? []}
          icon={<LockClosedIcon />}
        />
        <FormBtn text="Log in" />
      </form>
    </div>
  );
}
