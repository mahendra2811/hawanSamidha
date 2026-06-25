import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Nav } from "./Nav";
import { CartButton } from "./CartButton";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-base/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label={site.name}>
            <span className="grad-gold grid h-9 w-9 place-items-center rounded-full font-display text-lg font-bold text-on-gold">
              अ
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-text">
              {site.name}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <Nav />
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {/* Cart lives in the bottom nav on mobile. */}
            <span className="hidden md:inline-flex">
              <CartButton />
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
}
