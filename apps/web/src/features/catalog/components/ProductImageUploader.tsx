import {
  ImagePlus,
  X,
  Upload,
} from "lucide-react";
import { useRef } from "react";

type ProductImageUploaderProps = {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
};

const ProductImageUploader = ({
  images,
  onChange,
  maxImages = 8,
}: ProductImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (
    files: FileList | null,
  ) => {
    if (!files) return;

    const incoming = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/"),
    );

    const combined = [
      ...images,
      ...incoming,
    ].slice(0, maxImages);

    onChange(combined);
  };

  const removeImage = (index: number) => {
    onChange(
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Product photos
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Upload different angles for better AI
            reconstruction.
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {images.length}/{maxImages}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Product photo ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                removeImage(index)
              }
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-white text-gray-500 transition hover:border-[var(--color-primary)] hover:bg-black/[0.02]"
          >
            <ImagePlus size={24} />

            <span className="mt-2 text-xs font-medium">
              Add photos
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) =>
          handleFiles(event.target.files)
        }
      />

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-[var(--color-primary)]/[0.05] p-4">
        <Upload
          size={17}
          className="mt-0.5 shrink-0"
          style={{
            color:
              "var(--color-primary)",
          }}
        />

        <p className="text-xs leading-5 text-gray-600">
          For the best result, upload front,
          side, back and angled views of the same
          furniture piece. T.Fundi will analyse
          the images and prepare the product
          configuration.
        </p>
      </div>
    </div>
  );
};

export default ProductImageUploader;