import db from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { Suspense } from "react";
import getSession from "@/lib/session";
import TweetDetailContent from "./tweet-detail-content";

async function getTweet(id: number, currentUserId?: number) {
  try {
    const tweet = await db.tweet.findUnique({
      where: { id },
      select: {
        id: true,
        tweet: true,
        created_at: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
        likes: currentUserId
          ? {
              where: {
                userId: currentUserId,
              },
              select: {
                id: true,
              },
            }
          : false,
        _count: {
          select: {
            likes: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            created_at: true,
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    return tweet;
  } catch {
    return null;
  }
}

const getCachedTweet = nextCache(getTweet, ["tweet-detail"], {
  tags: ["tweet-detail"],
  revalidate: 60,
});

export default async function TweetDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-5 text-white">로딩 중...</div>}>
      <TweetDetailWrapper params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function TweetDetailWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const id = Number(resolvedParams.id);
  if (!id) return notFound();

  const session = await getSession();
  const tweet = await getCachedTweet(id, session.id);
  if (!tweet) return notFound();

  // page 쿼리스트링이 있으면 /?page=값, 없으면 /
  const backHref = resolvedSearchParams?.page
    ? `/?page=${resolvedSearchParams.page}`
    : "/";

  return (
    <TweetDetailContent
      tweet={tweet}
      session={{ id: session.id || 0 }}
      backHref={backHref}
    />
  );
}
