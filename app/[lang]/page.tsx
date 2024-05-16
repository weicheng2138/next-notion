import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home({ params }: { params: { lang: string } }) {
  return (
    <main className="h-svh flex-col flex gap-4 justify-center items-center px-2 sm:px-3 max-w-5xl w-full">
      <h1 className="max-w-xl text-center font-bold sm:text-3xl text-xl">
        Notion-Powered Next.js Boilerplate: Seamless Content Management with
        Minimal Locale Settings
      </h1>
      <Button asChild>
        <Link href={`${params.lang}/blog`}>Go To Blog Page</Link>
      </Button>
    </main>
  );
}
