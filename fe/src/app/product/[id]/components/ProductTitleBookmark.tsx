interface ProductTitleBookmarkProps {
  productName: string;
}

export default function ProductTitleBookmark({ productName }: ProductTitleBookmarkProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <h1 className="text-2xl lg:text-3xl font-bold text-primary leading-tight">
        {productName}
      </h1>
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-card">
        <svg className="w-6 h-6 text-foreground-secondary hover:text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
      </button>
    </div>
  );
} 