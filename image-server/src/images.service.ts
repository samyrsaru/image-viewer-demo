import { ImageData } from "./ImageData.js";

const imagesMock: ImageData[] = [
  {
    name: "image 1",
    url: "https://plus.unsplash.com/premium_photo-1697729870676-85a2eee0c593",
  },
  {
    name: "image 2",
    url: "https://images.unsplash.com/photo-1459789587767-1a947412a440",
  },
  {
    name: "image 3",
    url: "https://images.unsplash.com/photo-1530538095376-a4936b35b5f0",
  },
  {
    name: "image 4",
    url: "https://images.unsplash.com/photo-1502700807168-484a3e7889d0",
  },
  {
    name: "image 5",
    url: "https://images.unsplash.com/photo-1525198499106-711be87c35f9",
  },
];

export const getImages = async () => {
  // TODO: Replace this mock with an images DB call
  return imagesMock;
};

export const postImage = async (image: ImageData) => {
  // TODO: Replace this mock with an images DB call
  imagesMock.push(image);
};
