"use client";

import { create } from "zustand";
import { SERVER_BASE } from "@/lib/api";

export type UploadStatus = "pending" | "uploading" | "success" | "error";

export interface UploadItem {
  id: string;
  file: File;
  fileName: string;
  progress: number; // 0~100
  status: UploadStatus;
  errorMessage?: string;
}

export interface UploadStore {
  queue: UploadItem[];
  maxWorkers: number;
  activeCount: number;

  enqueue: (files: File[]) => void;
  startNext: () => void;

  updateProgress: (id: string, progress: number) => void;
  markSuccess: (id: string) => void;
  markError: (id: string, message: string) => void;

  removeItem: (id: string) => void;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  queue: [],
  maxWorkers: 3,
  activeCount: 0,

  enqueue: (files) => {
    const uploadItems = files.map(
      (f: File) =>
        ({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          file: f,
          fileName: f.name,
          progress: 0,
          status: "pending",
        }) as UploadItem,
    );

    set((state) => ({
      queue: [...state.queue, ...uploadItems],
    }));

    get().startNext();
  },

  // TODO: upload process is fake for now - replace err message to actual error message from the server
  startNext: async () => {
    const { activeCount, maxWorkers, queue } = get();
    if (activeCount >= maxWorkers) return;

    const next = queue.find((it) => it.status === "pending");
    if (!next) return;

    set((state) => ({
      activeCount: state.activeCount + 1,
      queue: state.queue.map((it) =>
        it.id === next.id ? { ...it, status: "uploading" } : it,
      ),
    }));

    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += 5;
        get().updateProgress(next.id, fakeProgress);
      }
    }, 200);

    try {
      const encodedFilename = btoa(encodeURIComponent(next.fileName));

      const res = await fetch(
        `${SERVER_BASE}/files/upload?filename=${encodedFilename}`,
        {
          method: "POST",
          body: next.file,
          credentials: "include",
        },
      );

      clearInterval(interval);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`upload failed (${res.status}) ${text}`);
      }

      get().updateProgress(next.id, 100);
      get().markSuccess(next.id);
    } catch (err: any) {
      clearInterval(interval);
      get().markError(next.id, err?.message || "failed uploading");
    }
  },

  updateProgress: (id, progress) => {
    set((state) => ({
      queue: state.queue.map((it) => (it.id === id ? { ...it, progress } : it)),
    }));
  },

  markSuccess: (id) => {
    set((state) => ({
      activeCount: state.activeCount - 1,
      queue: state.queue.map((it) =>
        it.id === id ? { ...it, status: "success", progress: 100 } : it,
      ),
    }));

    get().startNext();
  },

  markError: (id, message) => {
    set((state) => ({
      activeCount: state.activeCount - 1,
      queue: state.queue.map((it) =>
        it.id === id
          ? {
              ...it,
              status: "error",
              progress: 100,
              errorMessage: message,
            }
          : it,
      ),
    }));

    get().startNext();
  },

  removeItem: (id) => {
    set((state) => ({
      queue: state.queue.filter((it) => it.id !== id),
    }));
  },
}));
