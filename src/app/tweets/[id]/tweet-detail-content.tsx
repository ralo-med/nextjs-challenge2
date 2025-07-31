"use client";

import { useOptimistic } from "react";
import Link from "next/link";
import AddTweet from "@/components/add-tweet";
import TimeAgo from "@/components/time-ago";
import LikeButton from "@/components/like-button";
import DeleteButton from "@/components/delete-button";
import ReplyList from "@/components/reply-list";
import { deleteTweet } from "@/app/(tweet-actions)/actions";

interface Reply {
  id: number;
  content: string;
  created_at: Date;
  user: {
    username: string;
  };
  userId: number;
}

interface Like {
  id: number;
}

interface Tweet {
  id: number;
  tweet: string;
  created_at: Date;
  userId: number;
  user: {
    username: string;
  };
  likes: Like[];
  _count: {
    likes: number;
  };
  replies: Reply[];
}

interface TweetDetailContentProps {
  tweet: Tweet;
  session: { id: number };
  backHref: string;
}

export default function TweetDetailContent({
  tweet,
  session,
  backHref,
}: TweetDetailContentProps) {
  const [optimisticState, addOptimisticReply] = useOptimistic(
    { replies: tweet.replies },
    (
      state,
      action: { type: "add" | "delete"; reply: Reply; replyId?: number }
    ) => {
      if (action.type === "add") {
        return {
          replies: [action.reply, ...state.replies],
        };
      } else if (action.type === "delete") {
        return {
          replies: state.replies.filter((reply) => reply.id !== action.replyId),
        };
      }
      return state;
    }
  );

  // 현재 사용자가 이 트윗을 좋아요했는지 확인
  const isLiked = Array.isArray(tweet.likes) && tweet.likes.length > 0;
  const isAuthor = session.id === tweet.userId;

  const handleOptimisticReply = (reply: Reply) => {
    addOptimisticReply({ type: "add", reply });
  };

  const handleDeleteTweet = async () => {
    await deleteTweet(tweet.id);
  };

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
          <AddTweet
            isReply={true}
            tweetId={tweet.id}
            onOptimisticReply={handleOptimisticReply}
          />

          {/* 구분선 */}
          <div className="w-full border-t border-gray-200 my-6"></div>

          {/* 트윗 상세 내용 */}
          <div className="relative w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
            <div className="mb-2 text-lg font-bold">{tweet.user?.username}</div>
            <div className="text-xl text-gray-900 mb-4">{tweet.tweet}</div>
            <div className="text-xs text-gray-400">
              <TimeAgo date={tweet.created_at.toString()} />
            </div>

            {/* 좋아요와 삭제 버튼 */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {session.id && (
                <LikeButton
                  isLiked={isLiked}
                  likeCount={tweet._count.likes}
                  tweetId={tweet.id}
                />
              )}

              <DeleteButton
                onDelete={handleDeleteTweet}
                isAuthor={isAuthor}
                title="트윗 삭제"
              />
            </div>
          </div>

          {/* 답글 목록 - 각각 별도 상자 */}
          <ReplyList
            replies={optimisticState.replies}
            currentUserId={session.id}
          />
        </div>
      </div>
    </div>
  );
}
