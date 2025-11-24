"use client";

import { apifetch, SERVER_BASE } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Link from "next/link";

type ThumbnailType = {
  sizeName: string;
  filePath: string;
};

type UploadData = {
  filePath: string; // this is relative file path to the server
  id: number;
  originalName: string;
  thumbnails?: {
    large?: ThumbnailType;
    medium?: ThumbnailType;
    small?: ThumbnailType;
  };
  mimeType: string;
};

type FilesPageResponse = {
  files: UploadData[];
  status: number;
  hasNext: boolean;
  nextPage: number;
};

const PAGE_SIZE = 12;

async function fetchFiles(page: number): Promise<FilesPageResponse> {
  const res = await apifetch(`/files?limit=${PAGE_SIZE}&page=${page}`);
  const json = (await res.json()) as { data: FilesPageResponse };

  return json.data;
}

export default function Files() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["files"],
      queryFn: ({ pageParam = 0 }) => fetchFiles(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextPage : undefined,
    });

  const filesList = useMemo(
    () => data?.pages.flatMap((p) => p.files ?? []) ?? [],
    [data],
  );

  if (status == "pending") {
    return (
      <div className="w-full max-w-7xl mx-auto p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square w-full rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full flex justify-center p-5">
        <p className="text-sm text-destructive">Failed to load files.</p>
      </div>
    );
  }

  if (filesList.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
        <Link
          href="/upload"
          className="mt-4 text-sm underline text-primary hover:opacity-80"
        >
          Upload a file
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-5 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-auto">
        {filesList.map((f) => {
          const thumbPath = f.thumbnails?.medium?.filePath;

          if (!thumbPath) {
            return (
              <div
                key={f.id}
                className="aspect-square rounded-lg border flex items-center justify-center text-xs text-muted-foreground"
              >
                {f.originalName}
              </div>
            );
          }

          return (
            <Link
              key={f.id}
              href={{
                pathname: `/files/${f.id}`,
                query: {
                  filePath: f.filePath,
                  mimeType: f.mimeType,
                  name: f.originalName,
                },
              }}
            >
              <img
                src={`${SERVER_BASE}${thumbPath}`}
                alt={f.originalName}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </Link>
          );
        })}
      </div>

      {hasNextPage && (
        <button
          className="px-4 py-2 text-sm rounded border"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "loading..." : "show more"}
        </button>
      )}
    </div>
  );
}
