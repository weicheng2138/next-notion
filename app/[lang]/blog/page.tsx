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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  }

  return (
    <main className="flex-col gap-2 pt-16 h-svh w-full max-w-5xl px-2 md:px-4">
      <h1 className="text-2xl mt-4">
        {dictionary["server-component"].page.blogs.title}
      </h1>
      <span className="text-muted-foreground text-sm mt-2">
        {dictionary["server-component"].page.blogs.description}
      </span>
      <Separator className="my-4" />

      {blogList.length > 0 && (
        <section className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 pb-20">
          {blogList.map((page) => {
            if (isFullPage(page) && page.properties["Name"].type === "title") {
              const blogId =
                page.properties["ID"].type === "rich_text"
                  ? page.properties["ID"].rich_text[0].plain_text
                  : "";
              return (
                <Link
                  key={page.id}
                  href={`/${params.lang}/blog/${page.properties["Name"].title[0].plain_text.split(" ").join("-")}-${blogId}`}
                >
                  <Card>
                    <CardCover>
                      <Image
                        className="rounded-t-lg z-0"
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
                      {page.properties["Tags"].type === "multi_select" && (
                        <CardContent className="flex gap-2">
                          {page.properties["Tags"].multi_select.map((tag) => {
                            return (
                              <Badge variant="outline" key={tag.id}>
                                {tag.name}
                              </Badge>
                            );
                          })}
                        </CardContent>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              );
            }
          })}
        </section>
      )}

      {blogList.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full px-4 gap-4">
          <Alert variant="default" className="max-w-xl w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {dictionary["server-component"].page.blogs.empty}
            </AlertTitle>
            <AlertDescription>
              {dictionary["server-component"].page.blogs["empty-detail"]}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  );
}
