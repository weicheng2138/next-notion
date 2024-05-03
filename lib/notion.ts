import "server-only";

import { Client } from "@notionhq/client";
import React from "react";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const fetchPages = React.cache(async () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is missing");
  }
  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Status",
      status: {
        equals: "Published",
      },
    },
  });
  console.log("NOTION API CALLING");
  return res.results;
});

export const fetchPageBlocks = React.cache(async (pageId: string) => {
  const res = await notion.blocks.children.list({ block_id: pageId });
  return res.results as BlockObjectResponse[];
});
