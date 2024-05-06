import Link from "next/link";
import { isFullPage } from "@notionhq/client";
import { fetchPageBlocks, fetchPublishedBlogList } from "@/lib/notion";
import { notFound } from "next/navigation";
import LocaleSwitcher from "../components/locale-switcher";
import { getDictionary } from "@/lib/locale";
import type { Locale } from "@/i18n-config";

type Props = {
  params: {
    lang: Locale;
  };
};
export default async function Page({ params }: Props) {
  console.log("params", params);
  const dictionary = await getDictionary(params.lang);
  console.log("dictionary", dictionary);
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
    <div className="flex-col gap-2">
      <h1>Blogs</h1>

      <LocaleSwitcher />
      <h2>{dictionary["server-component"].author}</h2>
      <ul>
        {blogList.map((page) => {
          if (isFullPage(page) && page.properties["Name"].type === "title") {
            return (
              <Link key={page.id} href={`blog/${page.id}`}>
                {page.properties["Name"].title[0].plain_text}
              </Link>
            );
          }
        })}
      </ul>
    </div>
  );
}
