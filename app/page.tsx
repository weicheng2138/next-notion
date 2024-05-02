import { isFullBlock, isFullPage } from "@notionhq/client";
import { notion } from "@/lib/notion";
export default async function Home() {
  console.log(process.env.NOTION_TOKEN);
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return <div>Notion token or database id is missing</div>;
  }
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  console.log(isFullBlock(pages.results[0]));
  console.log(isFullPage(pages.results[0]));
  console.log(pages.results.map((page) => page.id));

  const pageIds = pages.results.map((page) => page.id);
  const blocks = await notion.blocks.children.list({ block_id: pageIds[0] });
  console.log(isFullBlock(blocks.results[0]));
  console.log(isFullPage(blocks.results[0]));
  console.log(blocks.results[2]);
  // if ("type" in blocks.results[0] && "paragraph" in blocks.results[0]) {
  //   console.log(blocks.results[0].paragraph.rich_text[0].plain_text);
  // }
  if (
    "type" in blocks.results[2] &&
    blocks.results[2].type === "callout" &&
    blocks.results[2].callout.icon &&
    blocks.results[2].callout.icon.type === "emoji"
  ) {
    console.log(blocks.results[2].callout.icon.emoji);
    return (
      <div>
        <h1>{blocks.results[2].callout.icon.emoji}</h1>
      </div>
    );
  }
  // pages.results.forEach(async (page) => {
  //   console.log(await notion.blocks.children.list({ block_id: page.id }));
  // });
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
