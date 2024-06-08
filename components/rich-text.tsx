import { cn } from "@/lib/utils";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Render a rich text block
 * Ingnore annotation for equation
 * @param textBlock - The rich text block to render
 * @returns The rendered rich text block
 * @example
 * ```tsx
 * <RichText textBlock={textBlock} />
 * ```
 */
export default function RichText({
  textBlock,
}: {
  textBlock: RichTextItemResponse;
  key: string;
}) {
  switch (textBlock.type) {
    case "text":
      if (textBlock.annotations.code) {
        return (
          <code className={cn("bg-gray-200 rounded-sm py-[0.1em] px-[0.2em]")}>
            {textBlock.plain_text}
          </code>
        );
      } else {
        return (
          <span
            className={cn(
              textBlock.annotations.bold && "font-bold",
              textBlock.annotations.italic && "italic",
              textBlock.annotations.strikethrough && "line-through",
              textBlock.annotations.underline && "underline",
            )}
          >
            {textBlock.href ? (
              <a
                href={textBlock.href}
                className="text-blue-600 dark:text-blue-500 hover:underline"
                rel="noreferrer noopener"
                target="_blank"
              >
                {textBlock.plain_text}
              </a>
            ) : (
              textBlock.plain_text
            )}
          </span>
        );
      }
    case "mention":
      return textBlock.plain_text;
    case "equation":
      return textBlock.plain_text;
  }
}
