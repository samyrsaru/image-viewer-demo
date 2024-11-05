import { useState } from "react";

export const usePostImageApi = () => {
  const [state, setState] = useState<{
    isLoading: boolean;
    error?: string;
  }>({
    isLoading: false,
  });

  const postImage = () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // TODO: implement the API call to post the image

    setTimeout(() => {
      alert("fake upload finished");
      setState((prev) => ({ ...prev, isLoading: false }));
    }, 1000);
  };

  return { postImage, ...state };
};
