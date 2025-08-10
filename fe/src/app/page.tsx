import { SearchBar } from "../components/ui";
import { Features, FAQ, News, Hero, Categories } from "../components/home";

export default function Home() {
  return (
    <div className="w-full items-center justify-items-center min-h-screen gap-16 bg-transparent font-[family-name:var(--font-geist-sans)]">
      <SearchBar />
      <Categories />
      <Hero />
      <Features />
      <FAQ />
      <div className="w-full bg-gradient-to-t from-accent-foreground to-background">
        <News />
      </div>
    </div>
  );
}
