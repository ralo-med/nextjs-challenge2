"use server";
import bcrypt from "bcrypt";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Where is my username???"
            : "Username must be a string!",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "No potatoes allowed!"),
    email: z.email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .check(async (ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: ctx.value.username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.issues.push({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        input: ctx.value,
      });
    }
  })
  .check(async (ctx) => {
    const user = await db.user.findUnique({
      where: {
        email: ctx.value.email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.issues.push({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        input: ctx.value,
      });
    }
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });

interface FormState {
  fieldErrors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
  };
}

export async function createAccount(
  prevState: FormState | null,
  formData: FormData
) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}
