"use client";

import { Suspense, useOptimistic, startTransition } from "react";
import TimeAgo from "./time-ago";
import DeleteButton from "./delete-button";
import { deleteReply } from "@/app/(tweet-actions)/actions";

interface Reply {
  id: number;
  content: string;
  created_at: Date;
  user: {
    username: string;
  };
  userId: number;
}

interface RepliesSuspenseProps {
  replies: Reply[];
  currentUserId: number;
}

function ReplyListContent({ replies, currentUserId }: RepliesSuspenseProps) {
  const [optimisticState, addOptimisticReply] = useOptimistic(
    { replies },
    (
      state,
      action: { type: "add" | "delete"; reply: Reply; replyId?: number }
    ) => {
      console.log("Reply optimistic update:", action);
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

  if (optimisticState.replies.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">
        답글 ({optimisticState.replies.length})
      </h3>
      {optimisticState.replies.map((reply) => {
        const isAuthor = reply.userId === currentUserId;

        const handleDeleteReply = async () => {
          try {
            await deleteReply(reply.id);
          } catch (error) {
            console.error("Delete reply failed:", error);
            // 에러 발생 시 optimistic 업데이트 되돌리기
            startTransition(() => {
              addOptimisticReply({
                type: "delete",
                reply,
                replyId: reply.id,
              });
            });
          }
        };

        const handleOptimisticDelete = () => {
          // Optimistic update - 즉시 UI에서 제거
          startTransition(() => {
            addOptimisticReply({
              type: "delete",
              reply,
              replyId: reply.id,
            });
          });
        };

        return (
          <div
            key={reply.id}
            className="ml-6 bg-white rounded-lg p-4 shadow-md border-l-4 border-accent-pink relative"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">
                  {reply.user.username}
                </span>
                <span className="text-xs text-gray-400">
                  <TimeAgo date={reply.created_at.toString()} />
                </span>
              </div>
              <DeleteButton
                onDelete={handleDeleteReply}
                isAuthor={isAuthor}
                title="답글 삭제"
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                onOptimisticDelete={handleOptimisticDelete}
              />
            </div>
            <p className="text-gray-800">{reply.content}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function RepliesSuspense({
  replies,
  currentUserId,
}: RepliesSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            답글 로딩 중...
          </h3>
          <div className="ml-6 bg-white rounded-lg p-4 shadow-md border-l-4 border-accent-pink animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <ReplyListContent replies={replies} currentUserId={currentUserId} />
    </Suspense>
  );
}
