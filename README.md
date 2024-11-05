# Getting started

![main](wiki-assets/main.png)
![image-viewer](wiki-assets/image-viewer.png)

# Features:

- upload local image by choosing or dragging a JPEG or PNG file.
- rotate the image left/right
- flip the image horizontally/vertically
- undo/redo action
- reset (it also clears undo/redo history)
- loading state during image upload
- fetch images array from graphql server
  - currently as json (name and url)

# Backlog:

- api to upload image to a cloud bucket
- api to update image
- fetching library (TanStack Query)
- zoom in / out

# Dev area

### Server:

This is a TS express graphql server.

Run locally:

> cd image-server\
> npm install\
> npm run build-run\
> cd ..

### Client:

Bootstrapped with `vite` using `react-ts` template and `react` plugin. Styling made with `tailwindcss`.

Run locally:

> cd image-viewer\
> npm install\
> npm run dev
