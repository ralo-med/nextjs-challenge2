import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddTweet from "@/components/add-tweet";
import TimeAgo from "@/components/time-ago";
import { unstable_cache as nextCache } from "next/cache";
import { Suspense } from "react";

async function getTweet(id: number) {
  try {
    const tweet = await db.tweet.findUnique({
      where: { id },
      select: {
        id: true,
        tweet: true,
        created_at: true,
        user: {
          select: {
            username: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            created_at: true,
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
      <TweetDetailContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function TweetDetailContent({
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

  const tweet = await getCachedTweet(id);
  if (!tweet) return notFound();

  // page 쿼리스트링이 있으면 /?page=값, 없으면 /
  const backHref = resolvedSearchParams?.page
    ? `/?page=${resolvedSearchParams.page}`
    : "/";

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            href={backHref}
            className="mb-4 inline-block text-accent-pink font-semibold hover:underline"
          >
            ← 목록으로
          </Link>
        </div>

        <div className="flex w-full flex-col gap-3">
          {/* 답글 추가 폼 - 상자 밖으로 */}
          <AddTweet isReply={true} tweetId={tweet.id} />

          {/* 구분선 */}
          <div className="w-full border-t border-gray-200 my-6"></div>

          {/* 트윗 상세 내용 */}
          <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
            <div className="mb-2 text-lg font-bold">{tweet.user?.username}</div>
            <div className="text-xl text-gray-900 mb-4">{tweet.tweet}</div>
            <div className="text-xs text-gray-400">
              <TimeAgo date={tweet.created_at.toString()} />
            </div>
          </div>

          {/* 답글 목록 - 각각 별도 상자 */}
          {tweet.replies.length > 0 && (
            <div className="w-full space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                답글 ({tweet.replies.length})
              </h3>
              {tweet.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-6 bg-white rounded-lg p-4 shadow-md border-l-4 border-accent-pink"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-800">
                      {reply.user.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      <TimeAgo date={reply.created_at.toString()} />
                    </span>
                  </div>
                  <p className="text-gray-800">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
