// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600">
        Sorry, the page you are looking for does not exist yet.
      </p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Go Home
      </Link>
    </section>
  );
}
