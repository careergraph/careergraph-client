import { Heart } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Button";
import { toast } from "sonner";

export default function ApplyBar({ onApply, disabled = false }) {
  const handleApplyClick = () => {
    if (typeof onApply === "function") {
      onApply();
      return;
    }
    toast.info("Tính năng ứng tuyển sẽ sẵn sàng trong thời gian tới.");
  };

  return (
    <div className="mt-4 w-full flex flex-wrap gap-3">
      <div className="flex-5">
        <PrimaryButton
          className="w-full"
          text="Ứng tuyển ngay"
          onClick={handleApplyClick}
          disabled={disabled}
        />
      </div>
      <div className="flex-2">
        <SecondaryButton
          text="Lưu công việc"
          className="w-full"
          icon={<Heart className="ml-2" size={18} />}
          onClick={() => toast.warning("Chức năng lưu công việc đang được phát triển.")}
        />
      </div>
    </div>
  );
}
