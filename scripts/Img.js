export default function img(file, width = 40, height = 40) {
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
