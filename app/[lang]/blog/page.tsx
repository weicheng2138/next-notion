import Link from "next/link";
import Image from "next/image";
import { isFullPage } from "@notionhq/client";
import { fetchPageBlocks, fetchPublishedBlogList } from "@/lib/notion";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/locale";
import type { Locale } from "@/i18n-config";
import {
  Card,
  CardContent,
  CardCover,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: {
    lang: Locale;
  };
};
export default async function Page({ params }: Props) {
  const dictionary = await getDictionary(params.lang);
  if (!process.env.NOTION_DATABASE_ID) {
    return <div>Notion database id is missing</div>;
  }
  const localeBlocks = await fetchPageBlocks(process.env.NOTION_DATABASE_ID);
  if (!localeBlocks) {
    return notFound();
  }
  const targetLocaleBlock = localeBlocks.find((block) => {
    if (block.type === "child_database") {
      return block.child_database.title === params.lang;
    }
  });

  if (!targetLocaleBlock) {
    return notFound();
  }
  const blogList = await fetchPublishedBlogList(targetLocaleBlock.id);
  // console.log(blocks);

  if (!blogList) {
    return notFound();
  }

  if (blogList.length === 0) {
    return <div>No blogs found</div>;
  }

  return (
    <main className="flex-col gap-2 pt-16 h-svh w-full max-w-5xl px-2 md:px-4">
      <h1 className="text-2xl mt-4">{dictionary["server-component"].title}</h1>
      <span>sdsdsdsddsds</span>

      <section className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
        {blogList.map((page) => {
          if (isFullPage(page) && page.properties["Name"].type === "title") {
            console.log(
              page.properties["ID"].type === "rich_text" &&
                page.properties["ID"].rich_text[0].plain_text,
            );
            return (
              <Link
                key={page.id}
                href={`blog/${page.properties["ID"].type === "rich_text" && page.properties["ID"].rich_text[0].plain_text}`}
              >
                <Card>
                  <CardCover>
                    <Image
                      className="rounded-t-lg"
                      src={
                        page.cover && page.cover.type === "external"
                          ? page.cover.external.url
                          : ""
                      }
                      alt="article cover"
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      fill
                    />
                  </CardCover>
                  <CardHeader>
                    <CardTitle className="font-bold">
                      {page.properties["Name"].title[0].plain_text}
                    </CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {page.properties["Name"].title[0].plain_text}
                  </CardContent>
                </Card>
              </Link>
            );
          }
        })}
      </section>
    </main>
  );
}
