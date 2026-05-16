import { Lightbulb, AlertTriangle, Coffee, Zap, BookOpen } from "lucide-react";
import { ReactNode } from "react";

type CalloutType = "tip" | "warning" | "stat" | "example" | "coffee";

const CONFIG: Record<CalloutType, {
  icon: ReactNode;
  bg: string; border: string;
  label: string; labelColor: string; textColor: string;
}> = {
  tip:     { icon: <Lightbulb size={15} />,     bg: "bg-amber-50",   border: "border-amber-300",  label: "Pro Tip",          labelColor: "text-amber-700",  textColor: "text-amber-900"  },
  warning: { icon: <AlertTriangle size={15} />, bg: "bg-red-50",     border: "border-red-300",    label: "Watch Out",        labelColor: "text-red-700",    textColor: "text-red-900"    },
  stat:    { icon: <Zap size={15} />,           bg: "bg-coffee-50",  border: "border-coffee-400", label: "Key Stat",         labelColor: "text-coffee-700", textColor: "text-coffee-900" },
  example: { icon: <BookOpen size={15} />,      bg: "bg-gray-50",    border: "border-gray-300",   label: "Real Example",     labelColor: "text-gray-600",   textColor: "text-gray-800"   },
  coffee:  { icon: <Coffee size={15} />,        bg: "bg-coffee-50",  border: "border-coffee-300", label: "DataLatte Take",   labelColor: "text-coffee-700", textColor: "text-coffee-900" },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = "tip", title, children }: CalloutProps) {
  const c = CONFIG[type];
  return (
    <div className={`my-6 rounded-xl border-l-4 ${c.border} ${c.bg} px-5 py-4 mdx-fade-left`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${c.labelColor}`}>
        {c.icon}
        {title ?? c.label}
      </div>
      <div className={`text-sm leading-relaxed ${c.textColor} [&_strong]:font-semibold [&_a]:underline`}>
        {children}
      </div>
    </div>
  );
}
