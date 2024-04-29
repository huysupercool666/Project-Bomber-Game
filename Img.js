export default function img(file) {
  const image = new Image();
  image.src = 'Image/' + file;
  return image;
}
