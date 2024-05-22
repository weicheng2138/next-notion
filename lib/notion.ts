import "server-only";

import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isFullPage,
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

export const fetchBlocksFromSlug = React.cache(
  async (locale: Locale, id: string | undefined) => {
    console.log("fetchBlocksFromSlug", locale, id);
    try {
      if (!process.env.NOTION_DATABASE_ID) {
        throw new Error("NOTION_DATABASE_ID is missing");
      }
      const localeBlocks = await notion.blocks.children.list({
        block_id: process.env.NOTION_DATABASE_ID,
      });
      if (!localeBlocks.results) {
        throw new Error("Locale blocks not found");
      }
      const targetLocaleBlock = (
        localeBlocks.results as BlockObjectResponse[]
      ).find((block) => {
        if (block.type === "child_database") {
          return block.child_database.title === locale;
        }
      });
      // console.log("targetLocaleBlock", targetLocaleBlock);
      if (!targetLocaleBlock) {
        throw new Error("Target locale block not found");
      }
      const blogList = await fetchPublishedBlogList(targetLocaleBlock.id);
      if (!blogList) {
        throw new Error("Blog list not found");
      }
      const targetBlog = blogList.find((blog) => {
        if (
          isFullPage(blog) &&
          blog.properties["Name"].type === "title" &&
          blog.properties["ID"].type === "rich_text"
        ) {
          return blog.properties["ID"].rich_text[0].plain_text === id;
        }
        return false;
      });
      if (!targetBlog) {
        throw new Error("Target database not found");
      }
      const blocks = await fetchPageBlocks(targetBlog.id);
      // console.warn(blocks);
      if (!blocks) {
        throw new Error("Cannot find blocks from specific id");
      }
      return {
        page: targetBlog,
        blocks,
      };

      // return res.results as BlockObjectResponse[];
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
  },
);
