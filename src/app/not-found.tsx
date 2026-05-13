import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">☕</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          This page is still brewing...
        </h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist — but your local marketing strategy does.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} /> Back home
          </Link>
          <Link href="/contact" className="btn-secondary">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
