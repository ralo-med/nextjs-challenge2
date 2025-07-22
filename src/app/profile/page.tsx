import { FireIcon } from "@heroicons/react/24/solid";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { logout } from "../logout/actions";

function FlameLogo({ className = "w-10 h-10" }: { className?: string }) {
  return <FireIcon className={`${className} text-accent-pink`} />;
}

export default async function Profile() {
  const session = await getSession();

  if (!session.id) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      created_at: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-page px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 w-full"
      />

      <FlameLogo className="mb-8 h-12 w-12" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Profile</h1>
          <p className="text-text-muted">Welcome back, {user.username}!</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-input space-y-4">
          <div>
            <label className="text-sm font-medium text-text-muted">
              Username
            </label>
            <p className="text-lg font-semibold text-text-dark">
              {user.username}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-text-muted">Email</label>
            <p className="text-lg font-semibold text-text-dark">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-text-muted">Bio</label>
            <p className="text-lg font-semibold text-text-dark">
              {user.bio || "No bio yet"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-text-muted">
              Member since
            </label>
            <p className="text-lg font-semibold text-text-dark">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full bg-accent-pink text-white py-3 px-4 rounded-full text-center font-medium hover:bg-opacity-90 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
