// src/components/AvatarCropModal.jsx
import { useRef, useState, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function AvatarCropModal({ imageSrc, onCancel, onCropComplete }) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const onImageLoad = useCallback((e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const handleConfirm = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const size = 300;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, size, size
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      onCropComplete(file);
    }, "image/jpeg", 0.92);
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">
            Crop Profile Picture
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop area - flex-1 so it fills available space between header and footer */}
        {/* Crop area */}
<div className="flex items-start justify-center bg-gray-100 p-4 overflow-y-auto flex-1 min-h-0">
  <ReactCrop
    crop={crop}
    onChange={(c) => setCrop(c)}
    onComplete={(c) => setCompletedCrop(c)}
    aspect={1}
    circularCrop
    keepSelection
  >
    <img
      ref={imgRef}
      src={imageSrc}
      alt="Crop preview"
      onLoad={onImageLoad}
      style={{ maxHeight: "45vh", width: "100%", objectFit: "contain", display: "block" }}
    />
  </ReactCrop>
</div>

        {/* Preview strip */}
        <div className="px-5 py-3 bg-gray-50 border-t flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {completedCrop && (
              <CropPreview imgRef={imgRef} completedCrop={completedCrop} />
            )}
          </div>
          <p className="text-xs text-gray-500">
            Drag to reposition · Resize handles to adjust
          </p>
        </div>

        {/* Actions - flex-shrink-0 ensures buttons are never cut off */}
        <div className="px-5 py-4 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completedCrop}
            className="px-4 py-2 rounded-xl text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium"
          >
            Apply & Upload
          </button>
        </div>

      </div>
    </div>
  );
}

function CropPreview({ imgRef, completedCrop }) {
  const canvasRef = useRef(null);

  useCallback(() => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas || !completedCrop?.width) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = 40;
    canvas.height = 40;

    ctx.beginPath();
    ctx.arc(20, 20, 20, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, 40, 40
    );
  }, [completedCrop, imgRef])();

  return <canvas ref={canvasRef} className="w-10 h-10 rounded-full" />;
}