import { UploadBox, UploadQueueList } from "@/components/client/Upload";

export default function Upload() {
  return (
    <main className="w-full md:h-[50dvh] flex flex-col items-center md:justify-center px-4 py-8">
      <section className="w-full max-w-3xl space-y-6">
        <UploadBox />
        <UploadQueueList />
      </section>
    </main>
  );
}
