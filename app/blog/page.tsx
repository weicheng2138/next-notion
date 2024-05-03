import Link from "next/link";
import { isFullPage } from "@notionhq/client";
import { fetchPages } from "@/lib/notion";
import { notFound } from "next/navigation";

export default async function Page() {
  const pages = await fetchPages();

  if (!pages) {
    return notFound();
  }

  if (pages.length === 0) {
    return <div>No blogs found</div>;
  }

  return (
    <div className="flex-col gap-2">
      <h1>Blogs</h1>
      <ul>
        {pages.map((page) => {
          if (isFullPage(page) && page.properties["Name"].type === "title") {
            return (
              <Link key={page.id} href={`/blog/${page.id}`}>
                {page.properties["Name"].title[0].plain_text}
              </Link>
            );
          }
        })}
      </ul>
    </div>
  );
}
