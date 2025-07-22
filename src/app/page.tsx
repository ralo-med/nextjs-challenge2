import Link from "next/link";
import { FireIcon } from "@heroicons/react/24/solid";

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <FlameLogo className="h-24 w-24" />
          <h1 className="text-4xl font-medium">챌린지</h1>
          <h2 className="text-2xl font-medium">챌린지에 어서오세요!</h2>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/create-account"
            className="flex w-full text-white items-center justify-center rounded-xl bg-accent-pink px-5 py-3 font-medium text-lg hover:bg-accent-pink/90 transition-colors"
          >
            시작하기
          </Link>

          <div className="flex justify-center gap-2 text-sm">
            <span>이미 계정이 있나요?</span>
            <Link href="/login" className="hover:underline font-medium">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
