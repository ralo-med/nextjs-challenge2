import Link from "next/link";
import { logout } from "@/app/logout/actions";
import { FireIcon } from "@heroicons/react/24/solid";

function FlameLogo({ className = "w-5 h-5" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-50 border-b border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center">
        {/* 홈 버튼 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-accent-pink hover:opacity-80 transition-opacity"
        >
          <FlameLogo />
          <span className="text-sm font-medium">홈</span>
        </Link>

        {/* 로그아웃 버튼 */}
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-accent-pink hover:opacity-80 transition-opacity"
          >
            로그아웃
          </button>
        </form>
      </div>
    </nav>
  );
}
