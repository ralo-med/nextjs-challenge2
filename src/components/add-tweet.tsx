"use client";

import { useTransition, useOptimistic } from "react";
import { addTweet, addReply } from "@/app/(tweet-actions)/actions";
import FormBtn from "./form-btn";
import FormInput from "./form-input";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Reply {
  id: number;
  content: string;
  created_at: Date;
  user: {
    username: string;
  };
  userId: number;
}

interface Tweet {
  id: number;
  tweet: string;
  created_at: Date;
  user: {
    username: string;
  };
  userId: number;
  _count: {
    likes: number;
  };
}

interface AddTweetProps {
  isReply?: boolean;
  tweetId?: number;
  onOptimisticReply?: (reply: Reply) => void;
  onOptimisticTweet?: (tweet: Tweet) => void;
}

export default function AddTweet({
  isReply = false,
  tweetId,
  onOptimisticReply,
  onOptimisticTweet,
}: AddTweetProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimisticState, addOptimisticUpdate] = useOptimistic(
    { content: "", isSubmitting: false },
    (state, newContent: string) => ({
      content: newContent,
      isSubmitting: true,
    })
  );

  const handleSubmit = (formData: FormData) => {
    setError(null);
    const content = formData.get("tweet") as string;

    // Optimistic update
    startTransition(() => {
      addOptimisticUpdate(content);
    });

    if (isReply && tweetId && onOptimisticReply && content) {
      // Optimistic update for reply
      const optimisticReply: Reply = {
        id: Date.now(), // 임시 ID
        content: content,
        created_at: new Date(),
        user: {
          username: "나", // 임시 사용자명
        },
        userId: 0, // 임시 사용자 ID
      };
      onOptimisticReply(optimisticReply);
    } else if (!isReply && onOptimisticTweet && content) {
      // Optimistic update for tweet
      const optimisticTweet: Tweet = {
        id: Date.now(),
        tweet: content,
        created_at: new Date(),
        user: {
          username: "나",
        },
        userId: 0,
        _count: {
          likes: 0,
        },
      };
      onOptimisticTweet(optimisticTweet);
    }

    startTransition(async () => {
      try {
        const result =
          isReply && tweetId
            ? await addReply(tweetId, formData)
            : await addTweet(null, formData);

        if (result && "error" in result && typeof result.error === "string") {
          setError(result.error);
        } else if (result && "success" in result) {
          // 성공 시 폼 초기화
          const form = formData.get("tweet")?.toString();
          if (form) {
            const input = document.querySelector(
              'input[name="tweet"]'
            ) as HTMLInputElement;
            if (input) {
              input.value = "";
            }
          }
        }
      } catch (err) {
        console.error("Tweet submission error:", err);
        setError("오류가 발생했습니다. 다시 시도해주세요.");
      }
    });
  };

  const title = isReply ? "답글 작성" : "새 트윗 작성";
  const placeholder = isReply
    ? "답글을 작성해주세요..."
    : "무슨 일이 일어나고 있나요?";
  const buttonText = optimisticState.isSubmitting
    ? isReply
      ? "답글 작성 중..."
      : "트윗 작성 중..."
    : isReply
    ? "답글 작성"
    : "트윗하기";

  return (
    <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <FormInput
            name="tweet"
            type="text"
            placeholder={placeholder}
            required
            disabled={isPending || optimisticState.isSubmitting}
            icon={<ChatBubbleLeftIcon />}
            errors={error ? [error] : []}
          />
        </div>
        <FormBtn text={buttonText} />
      </form>
    </div>
  );
}
