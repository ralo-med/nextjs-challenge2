"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

const tweetSchema = z.object({
  tweet: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "트윗 내용이 필요합니다"
          : "트윗 내용은 문자열이어야 합니다!",
    })
    .min(1, "트윗 내용을 입력해주세요")
    .max(280, "트윗은 280자 이하여야 합니다"),
});

export async function addTweet(_: unknown, formData: FormData) {
  const data = {
    tweet: formData.get("tweet"),
  };

  const result = tweetSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  const session = await getSession();
  await db.tweet.create({
    data: {
      tweet: result.data.tweet,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteTweet(tweetId: number) {
  const session = await getSession();

  const tweet = await db.tweet.findUnique({
    where: { id: tweetId },
    include: { user: true },
  });

  if (!tweet) {
    return { error: "트윗을 찾을 수 없습니다" };
  }

  if (tweet.userId !== session.id) {
    return { error: "삭제 권한이 없습니다" };
  }

  await db.tweet.delete({ where: { id: tweetId } });
  revalidatePath("/");
  return { success: true };
}
