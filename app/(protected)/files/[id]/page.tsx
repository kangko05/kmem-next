import type { Metadata } from "next";
import Link from "next/link";
import { SERVER_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DeleteFileButton } from "@/components/client/DeleteFileButton";

type Props = {
  params: Promise<{ id: number }>;
  searchParams: Promise<{
    filePath?: string;
    mimeType?: string;
    name?: string;
  }>;
};

export const metadata: Metadata = {
  title: "File detail",
};

export default async function FileDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { filePath, mimeType, name } = await searchParams;

  if (!filePath || !mimeType) {
    return (
      <main className="w-full flex justify-center px-4 py-10">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            failed to load file information
          </p>
          <Button asChild size="sm">
            <Link href="/files">Back to files</Link>
          </Button>
        </div>
      </main>
    );
  }

  const src = `${SERVER_BASE}${filePath}`;
  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");

  return (
    <main className="w-full flex justify-center px-4 py-8">
      <section className="w-full max-w-3xl flex flex-col gap-6">
        {/* preview */}
        <div className="flex items-center justify-center rounded-xl overflow-hidden min-h-[260px]">
          {isImage && (
            <img
              src={src}
              alt={name ?? "uploaded file"}
              className="max-h-[70vh] w-auto object-contain"
            />
          )}

          {isVideo && (
            <video
              src={src}
              controls
              className="max-h-[70vh] w-auto rounded-lg bg-black"
            />
          )}

          {!isImage && !isVideo && (
            <div className="text-sm text-muted-foreground text-center px-4">
              This file type is not supported for preview.
            </div>
          )}
        </div>

        {/* info & actions */}
        <div className="space-y-4">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold break-all">
              {name ?? "Untitled file"}
            </h1>
            <p className="text-xs text-muted-foreground">MIME: {mimeType}</p>
          </header>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={src} download={name ?? undefined}>
                Download
              </a>
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link href="/files">Back to files</Link>
            </Button>

            <DeleteFileButton fileId={id} />
          </div>
        </div>
      </section>
    </main>
  );
}
