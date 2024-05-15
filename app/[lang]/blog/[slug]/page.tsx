import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n-config";
import { fetchPageBlocks } from "@/lib/notion";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: { slug: string; lang: Locale };
}) {
  if (!process.env.NOTION_DATABASE_ID) {
    return <div>Notion database id is missing</div>;
  }
  try {
    const localeBlocks = await fetchPageBlocks(process.env.NOTION_DATABASE_ID);
    if (!localeBlocks) {
      return notFound();
    }

    const targetLocaleBlock = localeBlocks.find((block) => {
      if (block.type === "child_database") {
        return block.child_database.title === params.lang;
      }
    });

    const blocks = await fetchPageBlocks(params.slug);
    console.warn(blocks);
    if (!blocks) {
      return notFound();
    }
    return (
      <main className="flex-col gap-2 pt-16 h-svh w-full max-w-5xl px-2 md:px-4">
        <h1>Blog Slug</h1>
        {blocks.map((block) => {
          if (block.type === "heading_2") {
            return (
              <h2 key={block.id}>{block.heading_2.rich_text[0].plain_text}</h2>
            );
          }
          if (block.type === "paragraph") {
            return (
              <div key={block.id}>
                <h2>{block.id}</h2>
                {block.paragraph.rich_text.map((text, index) => {
                  if (text.type === "text" && text.href) {
                    return (
                      <a
                        key={`${text.plain_text}_${index}`}
                        href={text.href}
                        className="text-blue-400"
                      >
                        {text.plain_text}
                      </a>
                    );
                  }
                  if (text.type === "text") {
                    return (
                      <p key={`${text.plain_text}_${index}`}>
                        {text.plain_text}
                      </p>
                    );
                  }
                })}
              </div>
            );
          }
        })}
      </main>
    );
  } catch (error) {
    if (typeof error === "string") {
      return (
        <div className="flex flex-col gap-4 items-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <span>{error}</span>
            </AlertDescription>
          </Alert>
          <Link href={`/blog`}>
            <Button variant={"ghost"}>
              <ChevronLeft />
              Go Back
            </Button>
          </Link>
        </div>
      );
    }
    throw error;
  }
}
