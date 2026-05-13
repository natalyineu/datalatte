import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
}

export default function BlogCard({ title, excerpt, slug, category, date, image, readTime }: BlogCardProps) {
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
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>{date}</span>
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
