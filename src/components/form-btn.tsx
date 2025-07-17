"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 h-12 w-full rounded-full border border-border-default bg-border-default/60 text-base font-medium text-text-dark shadow-button hover:bg-border-default active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-accent-gold/20 transition disabled:bg-neutral-400 disabled:cursor-not-allowed"
    >
      {pending ? <span className="text-white/70">loading...</span> : text}
    </button>
  );
}
