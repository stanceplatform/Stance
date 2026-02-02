import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image to the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg');
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

const ImageCropper = ({ imageSrc, onCancel, onSave, circular = true }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex justify-center items-center">
      <div className="relative w-full max-w-md h-full md:h-auto md:aspect-[9/16] md:max-h-[90vh] bg-black flex flex-col overflow-hidden">
        <div className="relative flex-1 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={false}
            objectFit="contain"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-8 pt-12">
          <button
            onClick={onCancel}
            className="text-white/90 font-medium text-lg px-4 py-2 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-transform active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
