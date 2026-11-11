import data from "@/data/social-links.json";

export function SocialRow() {
  return (
    <section
      data-reveal="social"
      className="-ml-2 mt-8 flex items-center gap-1 border-t border-white/10 pt-3"
    >
      {data.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          title={item.tip}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <img src={item.icon} alt="" width={16} height={16} className="opacity-80" />
        </a>
      ))}
    </section>
  );
}
