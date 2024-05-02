import { fetchPages } from "@/lib/notion";

export default async function Page() {
  const pages = await fetchPages();
  console.log(pages);
  return <h1>BLOGS LIST</h1>;
}
