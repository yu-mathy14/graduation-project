import Link from "next/link";

export default function Header() {
  return (
    <header>
      <h1>🏀Basketball Manager🏀</h1>
      
      {/* どのページからでもトップページに遷移できる */}
      <nav>
        <Link href="/">
          ホーム
        </Link>
      </nav>
    </header>
  );
}