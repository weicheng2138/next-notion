import { notion } from "@/lib/notion";
import LocaleSwitcher from "@/components/locale-switcher";
import Header from "@/components/header";
export default async function Home({ params }: { params: { lang: string } }) {
  // if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  //   return <div>Notion token or database id is missing</div>;
  // }
  // const res = await notion.blocks.children.list({
  //   block_id: "c7690f8a87ef4496887052473be744c9",
  // });
  // const ids = res.results.map((block) => {
  //   return block.id;
  // });
  // console.log(ids);
  // pages.results.forEach(async (page) => {
  //   console.log(await notion.blocks.children.list({ block_id: page.id }));
  // });
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
