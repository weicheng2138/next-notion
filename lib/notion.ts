import "server-only";

import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isNotionClientError,
} from "@notionhq/client";
import React from "react";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { type Locale } from "@/i18n-config";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const fetchPublishedBlogList = React.cache(
  async (databaseId: string) => {
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error("NOTION_DATABASE_ID is missing");
    }
    const res = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
    });
    console.log("NOTION API CALLING");
    // console.log(res.results);
    return res.results;
  },
);

export const fetchPageBlocks = React.cache(async (pageId: string) => {
  try {
    const res = await notion.blocks.children.list({ block_id: pageId });
    return res.results as BlockObjectResponse[];
  } catch (error) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          break;
        case APIErrorCode.ObjectNotFound:
          break;
        case APIErrorCode.Unauthorized:
          break;
        case APIErrorCode.ValidationError:
          break;
        default:
        // you could even take advantage of exhaustiveness checking
      }
      return Promise.reject(error.message);
    }
    return Promise.reject(error);
  }
});

export const getDatabaseIdByLocale = (locale: string) => {};
