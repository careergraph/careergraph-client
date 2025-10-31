import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function AvatarCropModal({
  open,
  onClose,
  src,            // dataURL ảnh gốc
  onConfirm,      // (blob) => void
}) {
  // vị trí người dùng kéo ảnh
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  // mức zoom
  const [zoom, setZoom] = useState(1);

  // vùng crop được tính toán bởi react-easy-crop (px theo ảnh gốc)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // callback khi crop thay đổi, thư viện trả về vùng đang chọn
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const MAX_SIZE = 512;
  // Hàm convert canvas -> blob
  const getCroppedImageBlob = async (imageSrc, cropPx) => {
    // cropPx = { x, y, width, height }
    const image = await loadImage(imageSrc);
  
  // Calculate scaled dimensions
  const scale = Math.min(1, MAX_SIZE / Math.max(cropPx.width, cropPx.height));
  const scaledWidth = cropPx.width * scale;
  const scaledHeight = cropPx.height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = scaledWidth;   // Use scaled size
  canvas.height = scaledHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropPx.x, cropPx.y, cropPx.width, cropPx.height,
    0, 0, scaledWidth, scaledHeight  // Scale down
  );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas export failed"));
            return;
          }
          resolve(blob);
        },
        "image/png",
        0.85
      );
    });
  };

  // helper load ảnh
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  // user bấm "Lưu"
  const handleSave = async () => {
    if (!croppedAreaPixels || !src) return;
    try {
      const blob = await getCroppedImageBlob(src, croppedAreaPixels);
      onConfirm?.(blob);   // gọi ngược lên ProfileCard
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold">Cắt ảnh đại diện</h2>
          <button
            className="text-sm text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        {/* Body: khu vực crop + zoom */}
        <div className="p-4 flex flex-col gap-4">
          {/* Khung crop */}
          <div className="relative w-full aspect-square bg-black/5 rounded-lg overflow-hidden">
            {/* react-easy-crop sẽ fill hết khung cha (position: absolute) */}
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1} // avatar vuông 1:1
              cropShape="round" // khung xem trước hình tròn, đẹp hơn cho avatar
              showGrid={false}  // ít rối mắt
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
              minZoom={1}
              maxZoom={4}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00000010",
                },
                mediaStyle: {
                  // đảm bảo ảnh không bị blur weird
                  imageRendering: "high-quality",
                },
              }}
            />
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Zoom
            </span>
            <input
              className="flex-1 accent-indigo-600"
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span className="text-xs text-gray-500 w-8 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}