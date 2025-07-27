"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteTweet } from "@/app/(tweet-actions)/actions";

interface TweetItemProps {
  tweet: {
    id: number;
    tweet: string;
    created_at: Date;
    userId: number;
    user: {
      username: string;
    };
  };
  currentPage: number;
  isAuthor: boolean;
}

export default function TweetItem({
  tweet,
  currentPage,
  isAuthor,
}: TweetItemProps) {
  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteTweet(tweet.id);
    }
  };

  return (
    <li className="relative">
      <Link
        href={`/tweets/${tweet.id}?page=${currentPage}`}
        className="block bg-white rounded-lg p-4 shadow hover:bg-gray-100 transition"
      >
        <div className="font-semibold">{tweet.user?.username}</div>
        <div className="text-gray-800">{tweet.tweet}</div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(tweet.created_at).toLocaleString()}
        </div>
      </Link>

      {isAuthor && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          title="삭제"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </li>
  );
}
