import {
  BlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import RichText from "@/components/rich-text";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  block: BlockObjectResponse;
};
export default function Block({ block }: Props) {
  // console.log("block:", block);
  switch (block.type) {
    case "paragraph":
      console.log("block.paragraph.rich_text:", block.paragraph);
      return (
        <>
          {block.paragraph.rich_text.length !== 0 ? (
            block.paragraph.rich_text.map((textBlock, index) => (
              <p key={`${textBlock.plain_text}_${index}`}>
                <RichText
                  textBlock={textBlock}
                  key={`${textBlock.plain_text}_${index}`}
                />
              </p>
            ))
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Notion Block</AlertTitle>
              <AlertDescription>
                <span>{`[${block.type}] contains empty block!`}</span>
              </AlertDescription>
            </Alert>
          )}
        </>
      );
    case "heading_1":
      return (
        <h1 className="text-3xl">
          {block.heading_1.rich_text.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl">
          {block.heading_2.rich_text.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl">
          {block.heading_3.rich_text.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </h3>
      );
    case "bulleted_list_item":
      return <li>{block.bulleted_list_item.rich_text[0].plain_text}</li>;
    case "numbered_list_item":
      return <li>{block.numbered_list_item.rich_text[0].plain_text}</li>;

    case "quote":
      return (
        <blockquote className="whitespace-pre-wrap break-words border-l-[3px] border-foreground px-[0.9em] py-[0.2em] m-0">
          {block.quote.rich_text.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </blockquote>
      );
    case "callout":
      return (
        <div className="bg-[#fbf3db]/30 p-4 rounded">
          {block.callout.icon && block.callout.icon.type === "emoji" && (
            <span
              role="img"
              aria-label={block.callout.icon.emoji}
              className="mr-2"
            >
              {block.callout.icon.emoji}
            </span>
          )}
          {block.callout.rich_text.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </div>
      );
    case "image":
      console.log("block.image:", block.image);
      return <BasicImage block={block} />;
    case "divider":
      return <hr className="border-t border-gray-500/20 my-2" />;
    default:
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notion Block</AlertTitle>
          <AlertDescription>
            <span>
              {`current block type [${block.type}] is not handled yet!`}
            </span>
          </AlertDescription>
        </Alert>
      );
  }
}

function BasicImage({ block }: { block: ImageBlockObjectResponse }) {
  return (
    <div>
      <div className="h-64 relative">
        <Image
          className="rounded-lg z-0"
          src={
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url
          }
          alt={
            block.image.caption.length > 0
              ? block.image.caption[0].plain_text
              : ""
          }
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {block.image.caption.length > 0 && (
        <figcaption className="py-2 whitespace-pre-wrap break-words text-gray-600/60">
          {block.image.caption.map((textBlock, index) => (
            <RichText
              textBlock={textBlock}
              key={`${textBlock.plain_text}_${index}`}
            />
          ))}
        </figcaption>
      )}
    </div>
  );
}
