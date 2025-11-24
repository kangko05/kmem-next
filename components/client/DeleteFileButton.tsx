"use client";

import { apifetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DeleteFileButton({ fileId }: { fileId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this file?")) return;

    try {
      setLoading(true);
      const res = await apifetch(`/files/${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("failed");
      }

      alert(`file id ${fileId} has been deleted`);

      router.push("/files");
    } catch (e) {
      alert("Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={loading}
      onClick={handleDelete}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
