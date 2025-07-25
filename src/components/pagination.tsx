import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Link
        href={`/?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold ${
          currentPage <= 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-300"
        }`}
        aria-disabled={currentPage <= 1}
      >
        이전
      </Link>
      <span className="px-4 py-2 font-semibold">
        {currentPage} / {totalPages}
      </span>
      <Link
        href={`/?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-300"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        다음
      </Link>
    </div>
  );
}
