"use server";

import { z } from "zod";

interface FormState {
  fieldErrors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  };
  success?: boolean;
  values?: {
    email?: string;
    username?: string;
    password?: string;
  };
}

export async function handleForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const data = Object.fromEntries(formData.entries());

  const numberRegex = /\d/;

  const formSchema = z.object({
    email: z.email().refine((v) => v.endsWith("@zod.com"), {
      message: "Only @zod.com emails are allowed",
    }),
    username: z.string().min(5, {
      message: "Username should be at least 5 characters long.",
    }),
    password: z
      .string()
      .min(10, {
        message: "Password should be at least 10 characters long",
      })
      .refine((value) => numberRegex.test(value), {
        message: "Password should contain at least one number(0123456789)",
      }),
  });

  const result = formSchema.safeParse(data);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return { fieldErrors, values: data };
  }

  return { success: true, values: data };
}
