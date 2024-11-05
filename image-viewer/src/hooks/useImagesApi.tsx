import { useEffect, useState } from "react";

export type ImageData = {
  name: string;
  url: string;
};

// TODO: enhance it by using a library like Apollo Client to handle the API calls or tan-stack query
export const useImagesApi = () => {
  const [state, setState] = useState<{
    images: ImageData[] | undefined;
    isLoading: boolean;
    error?: string;
  }>({
    images: undefined,
    isLoading: true,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        // TODO: in this quick sketch we receive image urls, instead of the images themselves
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: "{images {name, url}}" }),
    })
      .then((r) => r.json())
      .then((data) => data.data.images)
      .then((images) => {
        setState({ images, isLoading: false });
      });
  }, []);

  return state;
};
