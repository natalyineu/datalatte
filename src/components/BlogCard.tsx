import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getGroup, GROUP_CONFIG } from "./blogCategories";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  rawDate: string;
  image: string;
  readTime: string;
  featured?: boolean;
}

export default function BlogCard({ title, excerpt, slug, category, date, rawDate, image, readTime, featured }: BlogCardProps) {
  const group = getGroup(category);
  const { Icon, gradient } = GROUP_CONFIG[group];

  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="col-span-full card overflow-hidden group flex flex-col sm:flex-row">
        {/* Image panel */}
        <div className="relative sm:w-72 shrink-0 h-52 sm:h-auto overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 288px"
            />
          ) : (
            <div className={`bg-gradient-to-br ${gradient} w-full h-full`} />
          )}
          {/* Group badge */}
          <div className={`absolute top-3 left-3 bg-gradient-to-br ${gradient} flex items-center gap-1.5 px-3 py-1.5 rounded-full`}>
            <Icon size={13} strokeWidth={2} className="text-white" />
            <span className="text-white text-xs font-semibold tracking-wide">{group}</span>
          </div>
        </div>
        {/* Content */}
        <div className="p-7 flex flex-col justify-center">
          <span className="text-xs font-medium text-gray-400 mb-2">{category}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-coffee-700 transition-colors leading-snug">
            {title}
          </h2>
          <p className="text-gray-500 text-sm line-clamp-3 mb-4">{excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <time dateTime={rawDate} className="font-medium text-coffee-700">{date}</time>
            <span>·</span>
            <span>{readTime}</span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 group-hover:gap-2 transition-all">
            Read more <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="card overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`bg-gradient-to-br ${gradient} w-full h-full`} />
        )}
        {/* Group icon badge */}
        <div className={`absolute top-3 left-3 bg-gradient-to-br ${gradient} flex items-center gap-1.5 px-2.5 py-1 rounded-full`}>
          <Icon size={11} strokeWidth={2} className="text-white" />
          <span className="text-white text-xs font-semibold tracking-wide">{group}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-gray-400 mb-1">{category}</span>
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-coffee-700 transition-colors leading-snug flex-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <time dateTime={rawDate} className="font-medium text-coffee-700">{date}</time>
            <span>·</span>
            <span>{readTime}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-coffee-700 group-hover:gap-1.5 transition-all">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
