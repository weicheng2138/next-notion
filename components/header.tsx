"use client";
import LocaleSwitcher from "@/components/locale-switcher";
import useBodyScrollable from "@/hooks/useBodyScrollable";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { Rss } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  lang: Locale;
  dictionary: Awaited<ReturnType<typeof getDictionary>>["client-component"];
};
export default function Header({ lang, dictionary }: Props) {
  console.log("rendering header");
  console.log(dictionary);
  const [isOpen, setIsOpen] = useState(false);
  const handleLocaleIsOpen = (value: boolean) => setIsOpen(value);

  const isScrollable = useBodyScrollable();
  return (
    <header
      className={cn(
        "flex justify-center items-center h-16 px-4 w-full top-0 right-0 left-0 fixed border-b-gray-200 border-b bg-background z-50",
        isScrollable && isOpen && "pr-[31px]",
      )}
    >
      <nav
        className={cn(
          "flex gap-2 w-full justify-between items-center max-w-5xl",
        )}
      >
        <Link href={`/${lang}/`}>
          <h1 className={cn("hidden md:block")}>Next Notion Boilerplate</h1>
          <Rss className={cn("block md:hidden")} />
        </Link>
        <div className="flex gap-3 justify-center items-center">
          <Link
            className="text-gray-500 hover:text-black font-light"
            href={`/${lang}/blog`}
          >
            {dictionary.header.nav.blogs}
          </Link>
          <LocaleSwitcher triggerOpen={handleLocaleIsOpen} />
        </div>
      </nav>
    </header>
  );
}
