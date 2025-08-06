import Link from 'next/link';
import { Features } from '@/components/ui/features-8';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-20">
      <span className="inline-flex flex-wrap items-center text-4xl font-bold mb-8">
        Make & Host&nbsp;
        <span className="text-blue-700 bg-blue-100 px-1 rounded relative inline-block z-1">
          HTML Sites
        </span>
      </span>
      <Link href="/auth/signup">
        <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 ease-in-out">
          Get Started
        </button>
      </Link>
      
      <div className="w-full mt-20">
        <Features />
      </div>
      
      <footer className="w-full mt-20 bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 Sitely. Made with ❤️ for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
