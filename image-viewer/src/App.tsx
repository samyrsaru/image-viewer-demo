import { useState } from "react";
import "./App.css";
import { UploadImage } from "./components/UploadImage";
import { ImageViewer } from "./ImageViewer";
import { useImagesApi } from "./hooks/useImagesApi";
import { Galery } from "./components/Galery";
import { Loader } from "./components/Loader";
function App() {
  const [openImageUrl, setOpenImageUrl] = useState<string | null>(null);
  const { images, isLoading } = useImagesApi();
  const onSelectedFile = (file: File | undefined) => {
    setOpenImageUrl(file ? URL.createObjectURL(file) : null);
  };

  const onSelectedImage = (url: string) => {
    setOpenImageUrl(url);
  };

  const onCloseImage = () => {
    setOpenImageUrl(null);
  };

  return (
    <div className="h-full w-full max-w-[1024px] mx-auto flex flex-col gap-4 overflow-auto">
      {openImageUrl ? (
        <ImageViewer imageUrl={openImageUrl} onCloseImage={onCloseImage} />
      ) : (
        <>
          <UploadImage onSelectedFile={onSelectedFile} />
          <div className="p-4 h-full flex flex-col gap-2">
            <span className="text-3xl">Galery</span>
            {isLoading ? (
              <Loader />
            ) : !images?.length ? (
              <span>Empty galery</span>
            ) : (
              <Galery images={images} onSelectedImage={onSelectedImage} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
