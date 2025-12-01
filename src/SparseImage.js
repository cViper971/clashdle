import React, { useEffect, useRef } from 'react';

function SparseImage({ src, totalGuesses }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const percentageVisible = Math.min(1.0, 0.01 + (totalGuesses * 0.005));

    const canvas = canvasRef.current; 
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image to get pixel data
      ctx.drawImage(img, 0, 0);

      // Get all pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data; // RGBA array

      // Create new blank image data
      const newImageData = ctx.createImageData(canvas.width, canvas.height);
      const newPixels = newImageData.data;

      // Randomly select which pixels to show
      for (let i = 0; i < pixels.length; i += 4) {
        if (Math.random() < percentageVisible) {
          // Show this pixel
          newPixels[i] = pixels[i];         // R
          newPixels[i + 1] = pixels[i + 1]; // G
          newPixels[i + 2] = pixels[i + 2]; // B
          newPixels[i + 3] = pixels[i + 3]; // A
        } else {
          // Hide this pixel (make transparent)
          newPixels[i + 3] = 0; // Alpha = 0
        }
      }

      // Clear canvas and put sparse pixels
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(newImageData, 0, 0);
    };

    img.src = src;
  }, [src, totalGuesses]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

export default SparseImage;
