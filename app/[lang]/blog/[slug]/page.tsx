import Block from "@/components/block";
import RichText from "@/components/rich-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/locale";
import { fetchBlocksFromSlug } from "@/lib/notion";
import { isFullPage } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { AlertCircle, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string; lang: Locale };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const formattedSlug = params.slug.split("-").slice(0, -1).join("-");
  // Title that is without the last ID
  const title =
    params.lang === "zh-TW" ? decodeURI(formattedSlug) : formattedSlug;
  return {
    title,
    description: "Generated by create next app",
  };
}

export default async function Page({
  params,
}: {
  params: { slug: string; lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);
  const slugDictionary = dictionary["server-component"].page.blogs.slug;
  if (!process.env.NOTION_DATABASE_ID) {
    return <div>Notion database id is missing</div>;
  }
  try {
    const { page, blocks } = await fetchBlocksFromSlug(
      params.lang,
      params.slug.split("-").pop(),
    );
    // console.warn(blocks);
    if (!blocks) {
      return notFound();
    }

    // Group blocks by type of bulleted_list_item and numbered_list_item
    const groupedBlocks = blocks.reduce(
      (acc, block) => {
        if (
          block.type === "bulleted_list_item" ||
          block.type === "numbered_list_item"
        ) {
          if (!acc.length || acc[acc.length - 1].type !== block.type) {
            acc.push({ type: block.type, blocks: [block] });
          } else {
            acc[acc.length - 1].blocks.push(block);
          }
        } else {
          acc.push({ type: block.type, blocks: [block] });
        }
        return acc;
      },
      [] as { type: string; blocks: BlockObjectResponse[] }[],
    );

    // console.log("page:", page);
    return (
      <main className="flex flex-col gap-5 sm:gap-7 pt-16 pb-20 w-full h-full max-w-3xl px-4 sm:px-6">
        {isFullPage(page) && (
          <div className="flex flex-col gap-2 pt-8">
            <h1 className="text-4xl font-bold">
              {page.properties["Name"].type === "title" &&
                page.properties["Name"].title.map((textBlock, index) => (
                  <RichText
                    textBlock={textBlock}
                    key={`${textBlock.plain_text}_${index}`}
                  />
                ))}
            </h1>

            <span className="text-muted-foreground text-xs">
              {page.last_edited_time &&
                `${slugDictionary["last-updated"]}${new Date(page.last_edited_time).toLocaleDateString()}`}
            </span>
            <div className="flex gap-2 mt-4">
              {page.properties["Tags"].type === "multi_select" &&
                page.properties["Tags"].multi_select.map((tag) => {
                  return (
                    <Badge variant="outline" key={tag.id}>
                      {tag.name}
                    </Badge>
                  );
                })}
            </div>
          </div>
        )}
        <Separator />
        {groupedBlocks.map((group, index) =>
          group.type === "bulleted_list_item" ||
          group.type === "numbered_list_item" ? (
            <List key={index} blocks={group.blocks} />
          ) : (
            group.blocks.map((block) => <Block key={block.id} block={block} />)
          ),
        )}
      </main>
    );
  } catch (error) {
    if (typeof error === "string") {
      return (
        <div className="h-svh flex flex-col items-center justify-center w-full px-4 max-w-xl gap-4">
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

type ListProps = {
  blocks: BlockObjectResponse[];
};
function List({ blocks }: ListProps) {
  if (!blocks.length) return null;

  const listType = blocks[0].type === "bulleted_list_item" ? "ul" : "ol";

  return (
    <>
      {listType === "ul" ? (
        <ul className="list-disc list-inside">
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </ul>
      ) : (
        <ol className="list-decimal list-inside">
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </ol>
      )}
    </>
  );
}
