import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/locale";
import Link from "next/link";

export default async function Home({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);
  return (
    <main className="h-svh flex-col flex gap-4 justify-center items-center px-2 sm:px-3 max-w-5xl w-full">
      <h1 className="max-w-xl text-center font-bold sm:text-3xl text-xl">
        {dictionary["server-component"].page.home.slogan}
      </h1>
      <Button asChild>
        <Link href={`${params.lang}/blog`}>
          {dictionary["server-component"].page.home.button}
        </Link>
      </Button>
    </main>
  );
}
