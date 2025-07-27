"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addTweet } from "@/app/(tweet-actions)/actions";
import FormBtn from "./form-btn";
import FormInput from "./form-input";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function AddTweet() {
  const [state, formAction] = useActionState(addTweet, null);
  const { pending } = useFormStatus();

  return (
    <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">새 트윗 작성</h3>
      <form action={formAction} className="space-y-4">
        <div>
          <FormInput
            name="tweet"
            type="text"
            placeholder="무슨 일이 일어나고 있나요?"
            required
            disabled={pending}
            icon={<ChatBubbleLeftIcon />}
            errors={
              state && "error" in state && typeof state.error === "string"
                ? [state.error]
                : []
            }
          />
        </div>
        <FormBtn text="트윗하기" />
      </form>
    </div>
  );
}
