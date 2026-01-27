import { breakingNews } from "@/data/newsData";

export default function NewsTicker() {
  const tickerContent = [...breakingNews, ...breakingNews];

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="container flex items-center gap-4">
        <span className="flex-shrink-0 bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-bold uppercase tracking-wider animate-pulse">
          Breaking
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-scroll whitespace-nowrap flex gap-16">
            {tickerContent.map((news, index) => (
              <span key={index} className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
