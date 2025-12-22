import { Heart } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Button";
import { toast } from "sonner";
import { UserAPI } from "~/services/api/user";
import { useState } from "react";
import { useUserStore } from "~/stores/userStore";

export default function ApplyBar({ onApply, jobId, disabled = false, isSaved = false }) {

  const { user } = useUserStore();
  const [isCallAPI, setIsCallAPI] = useState(false);
  const [savedStatus, setSavedStatus] = useState(isSaved);
  const handleApplyClick = () => {
    if (typeof onApply === "function") {
      onApply();
      return;
    }
    toast.info("Tính năng ứng tuyển sẽ sẵn sàng trong thời gian tới.");
  };
  const handleSaveClick = async () => {
    if (jobId != null) {
      if(!savedStatus){
        try {
              setIsCallAPI(true);
              if(user?.candidateId == null || jobId == null  ){
                toast.info("Tính năng ứng tuyển sẽ sẵn sàng trong thời gian tới.");
                return;
              }
              // Gọi API lấy chi tiết job
              const data = await UserAPI.savedJobs(user.candidateId, jobId);
              if (!data) {
                toast.error("Có lỗi xảy ra");
                return;
              }
              toast.success(data?.message);
              setSavedStatus(!savedStatus);
      
            } catch (err) {
              console.log(err)
              toast.error(err?.response?.data?.message)
              // toast.error("Có lỗi xảy ra");
            }finally {
              setIsCallAPI(false);
            }
            return;
      }else {
          try {
              setIsCallAPI(true);
              if(user?.candidateId == null || jobId == null  ){
                toast.info("Tính năng ứng tuyển sẽ sẵn sàng trong thời gian tới.");
                return;
              }
              // Gọi API lấy chi tiết job
              const data = await UserAPI.unSavedJobs(user.candidateId, jobId);
      
              if (!data) {
                toast.error("Có lỗi xảy ra");
                return;
              }
              toast.success(data?.message);
              setSavedStatus(!savedStatus);
            } catch (err) {
              console.log(err)
              toast.error(err?.response?.data?.message)
              // toast.error("Có lỗi xảy ra"); 
            }finally {
              setIsCallAPI(false);
            }
            return;
      }
    }
  }


  return (
    <div className="mt-4 w-full flex flex-wrap gap-3">
      <div className="flex-5">
        <PrimaryButton
          className="w-full"
          text= {disabled ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
          onClick={handleApplyClick}
          disabled={disabled}
        />
      </div>
      <div className="flex-2">
        <SecondaryButton
          text="Lưu công việc"
          className="w-full"
          icon={<Heart className="ml-2" size={18} />}
          onClick={handleSaveClick}
          isSaved={savedStatus}
          disabled={isCallAPI}
          isCallAPI={isCallAPI}

        />
      </div>
    </div>
  );
}