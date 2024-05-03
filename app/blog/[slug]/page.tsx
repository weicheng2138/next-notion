import { fetchPageBlocks } from "@/lib/notion";
import { notFound } from "next/navigation";
export default async function Page({ params }: { params: { slug: string } }) {
  const blocks = await fetchPageBlocks(params.slug);

  if (!blocks) {
    return notFound();
  }
  // console.log(blocks);
  return (
    <div>
      <h1>Blog Slug</h1>
      {blocks.map((block) => {
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
                    <p key={`${text.plain_text}_${index}`}>{text.plain_text}</p>
                  );
                }
              })}
            </div>
          );
        }
      })}
    </div>
  );
}
