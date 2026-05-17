import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  rawDate: string;
  image: string;
  readTime: string;
}

export default function BlogCard({ title, excerpt, slug, category, date, rawDate, image, readTime }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="card overflow-hidden group block">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-coffee-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span title={rawDate} className="flex items-center gap-1 font-medium text-coffee-700">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="2" width="14" height="13" rx="2"/>
              <path d="M1 6h14M5 1v2M11 1v2" strokeLinecap="round"/>
            </svg>
            {date}
          </span>
          <span>·</span>
          <span>{readTime}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-coffee-700 transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 group-hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
