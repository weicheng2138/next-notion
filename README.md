This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Dev Issues

- [ ] Deal with the server console to browser console issue
- [x] Notion API ans types
- [x] Usability of the `react-notion-x`. There no one mantaining the project and it's not working properly.
- [x] i18n with [Minimal i18n routing and translations]('https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing')

## Notion API

### Setup

1. Create a new integration in Notion from [here](https://www.notion.so/my-integrations)
2. After creating the integration, you will get the `Integration Secret` which you will use to authenticate your requests.
3. Click `show` to get the secret and copy it, which is something like `secret_...`.
4. Create a new database in Notion and add some posts in it.
5. Press the `...` button on the top right corner of the database and click on `Connect to` and click the integration name you created.
6. Copy the `Database ID` from the URL of the database, which is something like `https://www.notion.so/...?v=123123123` and the `...` is the `Database ID`.
7. Create a new `.env.local` file in the root of the project and add the following environment variables:
   ```env
   NOTION_API_SECRET=secret_...
   NOTION_DATABASE_ID=...
   ```
8. Install the `@notionhq/client` official package by running:
   ```bash
   pnpm add @notionhq/client
   ```

### Usage

2. **type guards** is working for all types of notion objects
3. If the block is a database, the block id is the database id
4. `.env.local` NOTION_DATABASE_ID is the entry point of notion database. This is a page with two inline databases with two locales.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
