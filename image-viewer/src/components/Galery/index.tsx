import { ImageData } from "../../hooks/useImagesApi";

export const Galery = ({
  images,
  onSelectedImage,
}: {
  images: ImageData[];
  onSelectedImage: (url: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <img
          onClick={() => onSelectedImage(image.url)}
          className="aspect-square object-cover"
          style={{}}
          alt={image.name}
          key={image.name}
          src={image.url}
        />
      ))}
    </div>
  );
};
