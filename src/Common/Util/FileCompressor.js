export const ImageCompressor = async (file, maxWidth = 1280, imgType, encoderOptions) => {
  let fileURL = await URL.createObjectURL(file);
  imgType = imgType || "image/jpeg";
  encoderOptions = encoderOptions || 0.7;
  let defaultBGColor = "#ffffff";

  // create img tag to calculate the size of image
  let image = await makeImageTag(fileURL);
  let newWidth = Math.min(image.width, maxWidth);
  let newHeight = Math.floor((image.height / image.width) * newWidth);

  // create a temporary canvas tag to draw the downscaled image on.
  let canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  // draw the downscaled image on the canvas and get the new data url
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = defaultBGColor;
  ctx.fillRect(0, 0, newWidth, newHeight);
  ctx.drawImage(image, 0, 0, newWidth, newHeight);
  let newDataURL = canvas.toDataURL(imgType, encoderOptions);

  // build file with url
  let response = await fetch(newDataURL);
  let blob = await response.blob();
  let newFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"));
  return newFile;
};

const makeImageTag = (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};
