"use client";

import { useTransition } from "react";
import { addTweet, addReply } from "@/app/(tweet-actions)/actions";
import FormBtn from "./form-btn";
import FormInput from "./form-input";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface AddTweetProps {
  isReply?: boolean;
  tweetId?: number;
}

export default function AddTweet({
  isReply = false,
  tweetId,
}: AddTweetProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
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
  const buttonText = isReply ? "답글 작성" : "트윗하기";

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
            disabled={isPending}
            icon={<ChatBubbleLeftIcon />}
            errors={error ? [error] : []}
          />
        </div>
        <FormBtn text={buttonText} />
      </form>
    </div>
  );
}
