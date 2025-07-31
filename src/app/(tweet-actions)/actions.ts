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

const replySchema = z.object({
  content: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "답글 내용이 필요합니다"
          : "답글 내용은 문자열이어야 합니다!",
    })
    .min(1, "답글 내용을 입력해주세요")
    .max(280, "답글은 280자 이하여야 합니다"),
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

export async function addReply(tweetId: number, formData: FormData) {
  const data = {
    content: formData.get("tweet"),
  };

  const result = replySchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  const session = await getSession();

  // 트윗이 존재하는지 확인
  const tweet = await db.tweet.findUnique({
    where: { id: tweetId },
  });

  if (!tweet) {
    return { error: "트윗을 찾을 수 없습니다" };
  }

  await db.reply.create({
    data: {
      content: result.data.content,
      user: {
        connect: {
          id: session.id,
        },
      },
      tweet: {
        connect: {
          id: tweetId,
        },
      },
    },
  });

  revalidatePath(`/tweets/${tweetId}`);
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

export async function likeTweet(tweetId: number) {
  const session = await getSession();

  if (!session.id) {
    return { error: "로그인이 필요합니다" };
  }

  // 트윗이 존재하는지 확인
  const tweet = await db.tweet.findUnique({
    where: { id: tweetId },
  });

  if (!tweet) {
    return { error: "트윗을 찾을 수 없습니다" };
  }

  // 이미 좋아요를 눌렀는지 확인
  const existingLike = await db.like.findFirst({
    where: {
      userId: session.id,
      tweetId: tweetId,
    },
  });

  if (existingLike) {
    return { error: "이미 좋아요를 눌렀습니다" };
  }

  await db.like.create({
    data: {
      userId: session.id,
      tweetId: tweetId,
    },
  });

  revalidatePath("/");
  revalidatePath(`/tweets/${tweetId}`);
  return { success: true };
}

export async function dislikeTweet(tweetId: number) {
  const session = await getSession();

  if (!session.id) {
    return { error: "로그인이 필요합니다" };
  }

  // 좋아요가 존재하는지 확인
  const like = await db.like.findFirst({
    where: {
      userId: session.id,
      tweetId: tweetId,
    },
  });

  if (!like) {
    return { error: "좋아요를 찾을 수 없습니다" };
  }

  await db.like.delete({
    where: {
      id: like.id,
    },
  });

  revalidatePath("/");
  revalidatePath(`/tweets/${tweetId}`);
  return { success: true };
}
