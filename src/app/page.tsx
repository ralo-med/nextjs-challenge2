import { FireIcon } from "@heroicons/react/24/solid";
import db from "@/lib/db";
import Pagination from "@/components/pagination";
import Link from "next/link";

const PAGE_SIZE = 10;

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page) > 0 ? Number(searchParams.page) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [tweets, totalCount] = await Promise.all([
    db.tweet.findMany({
      orderBy: { created_at: "desc" },
      skip,
      take: PAGE_SIZE,
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
    }),
    db.tweet.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <FlameLogo className="h-24 w-24" />
          <h1 className="text-4xl font-medium">챌린지</h1>
          <h2 className="text-2xl font-medium">트윗 목록</h2>
        </div>

        <div className="flex w-full flex-col gap-3">
          {/* 페이징 네비게이션 */}
          <Pagination currentPage={page} totalPages={totalPages} />
          {/* 트윗 목록 렌더링 */}
          <ul className="w-full space-y-4">
            {tweets.map((tweet) => (
              <li key={tweet.id}>
                <Link
                  href={`/tweets/${tweet.id}?page=${page}`}
                  className="block bg-white rounded-lg p-4 shadow hover:bg-gray-100 transition"
                >
                  <div className="font-semibold">{tweet.user?.username}</div>
                  <div className="text-gray-800">{tweet.tweet}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(tweet.created_at).toLocaleString()}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
