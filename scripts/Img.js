export default function img(file, width, height) {
  const image = new Image();
  image.onload = () => {
    if (width && height) {
      image.width = width;
      image.height = height;
    }
  };
  image.src = "/Image/" + file;
  return image;
}
