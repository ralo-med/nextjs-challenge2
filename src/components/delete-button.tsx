"use client";

import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  isAuthor: boolean;
  title?: string;
  className?: string;
  onOptimisticDelete?: () => void;
}

export default function DeleteButton({
  onDelete,
  isAuthor,
  title = "삭제",
  className = "text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50",
  onOptimisticDelete,
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!isAuthor) return;

    // Optimistic update
    if (onOptimisticDelete) {
      onOptimisticDelete();
    }

    startTransition(async () => {
      try {
        await onDelete();
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    });
  };

  if (!isAuthor) return null;

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={className}
      title={title}
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  );
}
