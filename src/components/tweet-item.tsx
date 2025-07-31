"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteTweet } from "@/app/(tweet-actions)/actions";
import TimeAgo from "./time-ago";
import LikeButton from "./like-button";

interface TweetItemProps {
  tweet: {
    id: number;
    tweet: string;
    created_at: Date;
    userId: number;
    user: {
      username: string;
    };
    likes: { id: number }[] | false;
    _count: {
      likes: number;
    };
  };
  currentPage: number;
  isAuthor: boolean;
  currentUserId?: number;
}

export default function TweetItem({
  tweet,
  currentPage,
  isAuthor,
  currentUserId,
}: TweetItemProps) {
  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteTweet(tweet.id);
    }
  };

  // 현재 사용자가 이 트윗을 좋아요했는지 확인
  const isLiked = Array.isArray(tweet.likes) && tweet.likes.length > 0;

  return (
    <li className="relative">
      <Link
        href={`/tweets/${tweet.id}?page=${currentPage}`}
        className="block bg-white rounded-lg p-4 shadow hover:bg-gray-100 transition"
      >
        <div className="font-semibold">{tweet.user?.username}</div>
        <div className="text-gray-800">{tweet.tweet}</div>
        <div className="text-xs text-gray-400 mt-1">
          <TimeAgo date={tweet.created_at.toISOString()} />
        </div>
      </Link>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        {currentUserId && (
          <LikeButton
            isLiked={isLiked}
            likeCount={tweet._count.likes}
            tweetId={tweet.id}
          />
        )}

        {isAuthor && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
            title="삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </li>
  );
}
