"use client";
import LocaleSwitcher from "@/components/locale-switcher";
import useBodyScrollable from "@/hooks/useBodyScrollable";
import { cn } from "@/lib/utils";
import { Rss } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLocaleIsOpen = (value: boolean) => setIsOpen(value);

  const isScrollable = useBodyScrollable();
  return (
    <header
      className={cn(
        "flex justify-center items-center h-16 px-4 w-full top-0 fixed border-b-gray-200 border-b bg-background",
        isScrollable && isOpen && "pr-[31px]",
      )}
    >
      <nav className="flex gap-2 w-full justify-between items-center max-w-5xl">
        <Link href="/">
          <h1 className={cn("hidden md:block")}>Next Notion Boilerplate</h1>
          <Rss className={cn("block md:hidden")} />
        </Link>
        <div className="flex gap-3 justify-center items-center">
          <Link
            className="text-gray-500 hover:text-black font-light"
            href={"/blog"}
          >
            Blog
          </Link>
          <LocaleSwitcher triggerOpen={handleLocaleIsOpen} />
        </div>
      </nav>
    </header>
  );
}
