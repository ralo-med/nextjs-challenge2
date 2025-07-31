"use client";

import { formatToTimeAgo } from "@/lib/utils";

interface TimeAgoProps {
  date: string;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  return <span>{formatToTimeAgo(date)}</span>;
}
