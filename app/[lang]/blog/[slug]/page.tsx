import Block from "@/components/block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n-config";
import { fetchPageBlocks, fetchPublishedBlogList } from "@/lib/notion";
import { isFullPage, isFullBlock } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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

    if (!targetLocaleBlock) {
      return notFound();
    }

    const blogList = await fetchPublishedBlogList(targetLocaleBlock.id);
    const targetDatabase = blogList.find((blog) => {
      if (
        isFullPage(blog) &&
        blog.properties["Name"].type === "title" &&
        blog.properties["ID"].type === "rich_text"
      ) {
        return blog.properties["ID"].rich_text[0].plain_text === params.slug;
      }
      return false;
    });
    if (!targetDatabase) {
      throw "Blog not found";
      // return notFound();
    }
    const blocks = await fetchPageBlocks(targetDatabase.id);
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

    return (
      <main className="flex flex-col gap-5 sm:gap-7 pt-16 pb-20 w-full h-full max-w-5xl px-4 sm:px-6">
        <h1>Blog Slug</h1>
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
        <div className="flex flex-col gap-4 items-center p-2 w-full max-w-xl">
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
