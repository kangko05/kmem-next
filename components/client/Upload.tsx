"use client";

import { Button } from "@/components/ui/button";
import { UploadItem, useUploadStore } from "@/lib/client/uploadStore";
import { X } from "lucide-react";
import { useCallback, useRef, useState, ChangeEvent, DragEvent } from "react";

const statusLabel: Record<string, string> = {
  pending: "대기 중",
  uploading: "업로드 중",
  success: "완료",
  error: "실패",
};

function UploadProgress({ item }: { item: UploadItem }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="h-1 w-full overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${item.progress}%` }}
          />
        </div>
        <span className="w-10 text-right text-[10px] tabular-nums">
          {item.progress}%
        </span>
      </div>
      {item.status === "error" && item.errorMessage && (
        <p className="text-[10px] text-destructive mt-1">{item.errorMessage}</p>
      )}
    </>
  );
}

function UploadItemSection({ item }: { item: UploadItem }) {
  const removeQueueItem = useUploadStore((s) => s.removeItem);

  return (
    <li className="flex flex-col gap-1 rounded-lg border bg-card px-3 py-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{item.fileName}</span>
        <div className="flex gap-2 items-center">
          <span
            className={[
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
              item.status === "success"
                ? "bg-emerald-500/10 text-emerald-500"
                : item.status === "error"
                  ? "bg-destructive/10 text-destructive"
                  : item.status === "uploading"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {statusLabel[item.status]}
          </span>

          {item.status != "uploading" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-muted-foreground/70 hover:text-muted-foreground"
              onClick={() => removeQueueItem(item.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          {item.status == "error" && (
            <Button className="h-6 w-6 p-0 text-muted-foreground/70 hover:text-muted-foreground">
              Retry
            </Button>
          )}
        </div>
      </div>
      <UploadProgress item={item} />
    </li>
  );
}

export function UploadQueueList() {
  const queue = useUploadStore((s) => s.queue);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Upload Queue
      </h2>

      {queue.length == 0 ? (
        <p className="text-xs text-muted-foreground">
          No files have been uploaded yet
        </p>
      ) : (
        <ul className="space-y-2">
          {queue.map((item) => (
            <UploadItemSection key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

export function UploadBox({}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const enqueue = useUploadStore((s) => s.enqueue);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length == 0) return;
      enqueue([...files]);
    },
    [enqueue],
  );

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = "";
  };

  const onClickSelect = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-sm",
        "transition-colors",
        isDragging
          ? "border-primary/80 bg-primary/5"
          : "border-border bg-muted/30",
      ].join(" ")}
    >
      <p className="mb-2 text-base font-medium">Upload File</p>
      <p className="mb-4 text-xs text-muted-foreground text-center">
        Drag files to this section
        <br />
        or click below button and choose files to upload
      </p>

      <Button size="sm" onClick={onClickSelect}>
        Choose files
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onChangeFile}
      />
    </div>
  );
}
