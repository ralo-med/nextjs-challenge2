"use server";

interface FormState {
  errors?: string[];
  success?: boolean;
}

export async function handleForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 700));

  const password = formData.get("password") as string;

  if (password === "12345") {
    return {
      success: true,
    };
  }

  return {
    errors: ["Wrong password"],
  };
}
