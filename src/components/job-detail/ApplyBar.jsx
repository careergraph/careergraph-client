import { Heart } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Button";


export default function ApplyBar() {
   return (
    <div className="mt-4 w-full flex flex-wrap gap-3">
      <div className="flex-5">
        <PrimaryButton className={"w-full"}text="Ứng tuyển ngay" onClick={() => alert("Ứng tuyển")} />
      </div>
      <div className="flex-2">
        <SecondaryButton
          text="Lưu công việc này"
          className={"w-full"}
          icon={<Heart className="ml-2" size={18} />}
          onClick={() => alert("Đã lưu")}
        />
      </div>
    </div>
  );
}
