"use client"; // Error components must be Client Components

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  APIErrorCode,
  ClientErrorCode,
  isNotionClientError,
  APIResponseError,
} from "@notionhq/client";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.warn("SLUG ERROR");
    // console.warn(error);
    let newError = error as APIResponseError;
  }, [error]);

  return (
    <div className="p-2 w-full max-w-xl">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
  if (error instanceof APIResponseError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
    // switch (error.code) {
    //   case ClientErrorCode.RequestTimeout:
    //     break;
    //   case APIErrorCode.ObjectNotFound:
    //     break;
    //   case APIErrorCode.Unauthorized:
    //     break;
    //   case APIErrorCode.ValidationError:
    //     break;
    //   default:
    //   // you could even take advantage of exhaustiveness checking
    // }
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
