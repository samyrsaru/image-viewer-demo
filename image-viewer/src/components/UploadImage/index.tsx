import { useRef, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";

export const UploadImage = ({
  onSelectedFile,
}: {
  onSelectedFile: (file: File | undefined) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="flex flex-col flex-shrink-0 gap-4 p-4 w-full">
      <label
        htmlFor="image-input"
        className="w-full min-h-40
        border-blue-800 border-2 border-dashed
        flex flex-wrap items-center gap-2
        text-blue-800 p-4 cursor-pointer"
        style={{
          opacity: isDragOver ? 0.5 : 1,
        }}
        onDrop={(e) => {
          e.preventDefault();

          const fileType = e.dataTransfer.files?.[0]?.type;
          if (fileType !== "image/png" && fileType !== "image/jpeg") {
            setIsDragOver(false);
            return;
          }

          if (!inputRef.current) return;
          inputRef.current.files = e.dataTransfer.files;
          onSelectedFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={() => {
          setIsDragOver(false);
        }}
      >
        <MdAddAPhoto className="text-xl" />
        <span>
          <span className="underline">Choose</span> or drop an image right here
        </span>
        <span className="ml-auto">JPEG, PNG</span>
      </label>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        name="image-input"
        id="image-input"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          onSelectedFile(e.target.files?.[0]);
        }}
      />
    </div>
  );
};
