import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TweetDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const id = Number(params.id);
  if (!id) return notFound();

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
    },
  });

  if (!tweet) return notFound();

  // page 쿼리스트링이 있으면 /?page=값, 없으면 /
  const backHref = searchParams?.page ? `/?page=${searchParams.page}` : "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-page px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 mt-10">
        <Link
          href={backHref}
          className="mb-4 inline-block text-accent-pink font-semibold hover:underline"
        >
          ← 목록으로
        </Link>
        <div className="mb-2 text-lg font-bold">{tweet.user?.username}</div>
        <div className="text-xl text-gray-900 mb-4">{tweet.tweet}</div>
        <div className="text-xs text-gray-400">
          {new Date(tweet.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
