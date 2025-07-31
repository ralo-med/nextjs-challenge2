"use client";

import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { useOptimistic, startTransition } from "react";
import { likeTweet, dislikeTweet } from "@/app/(tweet-actions)/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  tweetId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => {
      console.log("Reducer called with payload:", payload);
      return {
        isLiked: !previousState.isLiked,
        likeCount: previousState.isLiked
          ? Math.max(0, previousState.likeCount - 1) // 음수 방지
          : previousState.likeCount + 1,
      };
    }
  );

  const onClick = async () => {
    startTransition(() => {
      reducerFn(undefined);
    });

    try {
      if (state.isLiked) {
        await dislikeTweet(tweetId);
      } else {
        await likeTweet(tweetId);
      }
    } catch (error) {
      console.error("Like action failed:", error);
      // 에러 발생 시 optimistic 업데이트를 되돌림
      startTransition(() => {
        reducerFn(undefined);
      });
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 transition-colors p-2 rounded-full hover:bg-accent-pink/10 ${
        state.isLiked
          ? "text-accent-pink"
          : "text-gray-400 hover:text-accent-pink"
      }`}
      title={state.isLiked ? "좋아요 취소" : "좋아요"}
    >
      {state.isLiked ? (
        <HeartIcon className="size-4" />
      ) : (
        <OutlineHeartIcon className="size-4" />
      )}
      <span className="text-xs">{state.likeCount}</span>
    </button>
  );
}
