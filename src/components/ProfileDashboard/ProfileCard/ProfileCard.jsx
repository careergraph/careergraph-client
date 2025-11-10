// ProfileCard.jsx
import { useState, useEffect, useRef } from "react";
import {
  Pencil,            // edit-alt
  Mail,              // envelope
  Smartphone,        // mobile
  User,              // user
  Cake,              // birthday-cake
  HeartHandshake,    // rings-wedding (gần nghĩa)
  Bolt,              // bolt-s
  ChevronDown,       // chevron-down
  Camera
} from "lucide-react";
import { UserAPI } from "~/services/api/user";
import AvatarCropModal from "../AvatarCropModal";
import RightDrawer from "../RightDrawer";
import PersonalForm from "./PersonForm";
import { toast } from "sonner";
import { normalizeAddress, normalizeContact } from "~/services/domain/candidate/profile.mapper";
import AvatarUser from "~/components/DefaultData/AvatarUser";
import { useLocation } from "~/hooks/use-location";
import { useUserStore } from "~/store/userStore";

export default function ProfileCard() {

  const {user} = useUserStore();
  const [info, setInfo] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(""); // preview avatar
  const [openEdit, setOpenEdit] = useState(false);

  const [addressCode, setAddressCode] = useState({ provinceCode:"", districtCode:"" })
  const [openCrop, setOpenCrop] = useState(false);

  const {
      provinceName,
      districtName,
    } = useLocation(addressCode?.provinceCode, addressCode?.districtCode);

  //dataUrl preview of picture original before crop 
  const [rawAvatarSrc, setRawAvatarSrc] = useState("")

  const fileInputRef = useRef(null);

  
  useEffect(()=> {

    if(!user) return;
    setInfo(user);
    setAddressCode({provinceCode: user?.primaryAddress?.province, districtCode: user?.primaryAddress?.district })
    if(user?.avatarUrl){
        setAvatarUrl(user?.avatarUrl);
      }
  },[user])

   // Map server info -> default form values
  const toFormDefaults = (d) =>({
    firstName: d?.firstName || "",
    lastName: d?.lastName || "",
    email: d?.email || "",
    provinceCode: d?.primaryAddress?.province || "",
    districtCode: d?.primaryAddress?.district || "",
    phone: d.primaryContact?.value?.trim(),
    birth: (d?.dateOfBirth || "").slice(0, 10), // giữ "YYYY-MM-DD"
    gender: d?.gender === "MALE" ? "Nam" : (d?.gender === "FEMALE" ? "Nữ" : ""),
    marital: d?.isMarried ? "Đã lập gia đình" : "Độc thân",
  })


   // Map form -> payload BE
  const toPayload = (f) => ({
    firstName: f.firstName?.trim(),
    lastName: f.lastName?.trim(),
    phone: f.phone?.trim(),
    dateOfBirth: f.birth || null, // giữ format yyyy-mm-dd
    gender: f.gender === "Nam" ? "MALE" : (f.gender === "Nữ" ? "FEMALE" : null),
    isMarried: f.marital === "Đã lập gia đình",

    contact: {
      type: "PHONE",
      value: f.phone?.trim(),
      isPrimary: true
    },

    address: {
      country: "VN",
        province: f.provinceCode || "",
        district: f.districtCode || "",
        // ward: f.ward || "",        // bạn có thể thêm field ward vào form sau
        isPrimary: true,
    }
  });


  const handleUpdateInfo  = async (values) => {

    setOpenEdit(false);
    if (!values) return; // bấm Hủy
    
    const payload = toPayload(values);

    try {
      const res = await UserAPI.updateInfo(payload);
      const data = res?.data ?? res;
      data.primaryAddress = normalizeAddress(data.addresses)
      data.primaryContact = normalizeContact(data.contacts)
      useUserStore.getState().updateUserPart(data)
    } catch (e) {
      toast.error(e.message || "Cập nhật thất bại")
    }
  };

  // ---------------------------------
  // Avatar flow
  // 1. click icon camera -> open file picker
  // 2. chọn file -> đọc thành dataURL -> mở modal crop
  // 3. crop xong -> nhận blob -> upload
  // ---------------------------------

  //open file picker 
  const openFileDialog = () => fileInputRef.current?.click();

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if(!file || !info?.candidateId) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawAvatarSrc(ev.target.result);
      setOpenCrop(true);
    }
    reader.readAsDataURL(file);

    // reset input để lần sau chọn lại được cùng file tên giống vẫn trigger
    e.target.value="";
  }

  // Nhận blob đã crop từ modal -> upload
  const handleCroppedAvatar = async (blob) => {
    setOpenCrop(false);
    if(!blob || !info?.candidateId) return;

    try {

      if (blob.size > 5 * 1024 * 1024) { // >5MB
        toast.error("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
        return;
      }
      // preview tạm thời bằng blob local
      const tempUrl = URL.createObjectURL(blob);
      setAvatarUrl(tempUrl);

      // chuẩn bị formData cho API upload
      const formData  = new FormData();
      formData.append("type", "AVATAR");
      formData.append("file", blob, "avatar.png");

      const res = await UserAPI.uploadCandidateFile({
        id: info.candidateId,
        body: formData,
      });
      useUserStore.getState().updateUserPart({ avatarUrl: res?.data })
    
      
      toast.success("Cập nhật ảnh đại diện thành công");
      
    }catch(err){
      toast.error(err.message || "Cập nhật thất bại")
    }

  }


  const addressText =
    provinceName || districtName
      ? [districtName, provinceName].filter(Boolean).join(", ")
      : "Thêm địa chỉ hiện tại";
  return (
    <>
      <div className="flex flex-col lg:flex-row p-3 rounded-[12px] bg-white shadow-sd-default relative gap-2 lg:gap-8 ">
        {/* Nút bút chỉnh sửa */}
        <button
          data-test-id="user-profile__edit-button"
          onClick={() => setOpenEdit(true)}
          className="flex w-[40px] h-[40px] rounded-full justify-center items-center cursor-pointer bg-transparent hover:bg-[#F9F7FF] transition-all duration-200 ease-in-out absolute top-[12px] right-[12px]"
          aria-label="Chỉnh sửa hồ sơ"
        >
          <Pencil size={18} className="text-se-grey-48" />
        </button>
  
        {/* Cột trái */}
        <div className="flex flex-1 flex-col gap-2">
          {/* (giữ style block nếu bạn đang crop ảnh ở nơi khác) */}
          <style>{`
            .input-range{-webkit-appearance:none;-moz-appearance:none;height:2px;border-top:1px solid #999;border-bottom:1px solid #999;background:#3f51b5;width:100%}
            .input-range::-moz-range-thumb{border:1px solid #3f51b5;background:#3f51b5;border-radius:50%;width:12px;height:12px;transition:box-shadow .15s cubic-bezier(.4,0,.2,1)}
            .input-range::-webkit-slider-thumb{-webkit-appearance:none;border:1px solid #3f51b5;background:#3f51b5;border-radius:50%;width:12px;height:12px;transition:box-shadow .15s cubic-bezier(.4,0,.2,1)}
            .crop-container{position:relative;width:300px;height:300px;zoom:1}
            .reactEasyCrop_CropArea{color:rgba(255,255,255,.8)!important;box-shadow:0 0 0 9999em rgba(0,0,0,.4)!important}
          `}</style>
  
          <input ref={fileInputRef} 
                type="file" 
                accept="image/jpg,image/jpeg,image/png" 
                className="hidden" 
                onChange={handleAvatarFileSelect} 
          />
  
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="inline-block rounded-full overflow-hidden relative" style={{ width: 80, minWidth: 80, height: 80 }}>
              {/* Nếu có ảnh thì dùng <img .../>; tạm hiển thị placeholder icon */}
              
                {avatarUrl? (
                  <img src={avatarUrl} 
                  alt={info?.firstName ?? "avatar"} className="w-full h-full object-cover rounded-full"/>
                ):(
                  <div className="w-full h-full rounded-full grid place-items-center">
                    <AvatarUser size="20" fontSize="3xl"/>                  
                    </div>
                )}
              
           
  
              {/* Nút đổi avatar đè lên */}
              <button
                  type="button"
                  onClick={openFileDialog}
                  data-test-id="user-profile__edit-avatar"
                  className="absolute bottom-0 right-0 z-[9] rounded-full cursor-pointer border border-[#E7E7E8] bg-white w-[28px] h-[28px] grid place-items-center"
                  title="Đổi ảnh đại diện"
                  aria-label="Đổi ảnh đại diện"
                >
                  <Camera size={14} className="text-grey-11" />
                </button>
              </div>
          </div>
  
          {/* Trạng thái tìm việc */}
          <div className="relative" data-test-id="user-profile__job-seeking-status">
            <div className="flex items-center w-max gap-2 rounded-[1024px] p-2 bg-[#F9F7FF] cursor-pointer">
              <Bolt size={14} className="text-purple-4" />
              <span className="text-14 leading-6 text-se-grey-48">Trạng thái tìm việc của bạn?</span>
              <ChevronDown size={16} className="text-se-grey-48" />
            </div>
          </div>
  
          {/* Tên + địa chỉ */}
          <div className="flex flex-col">
            <h3 className="text-18 leading-7 text-se-neutral-900 font-semibold tracking-[-.16px] break-word">
              {info?.firstName ? `${info?.lastName} ${info?.firstName} `  : "Người dùng"}
            </h3>
            <p className="text-14 leading-6 font-normal text-se-accent-100 cursor-pointer">
              {addressText}
            </p>
          </div>
        </div>
  
        {/* Divider khi < lg */}
        <div className="w-full lg:hidden" data-test-id="common__divider">
          <div className="w-full h-[1px] bg-[#EFEFF0]" />
        </div>
  
        {/* Cột phải */}
        <div className="flex flex-1 flex-col gap-1 justify-end">
          {/* Email */}
          <div className="flex items-center flex-wrap" data-test-id="user-profile__info__email">
            <div className="flex gap-2 items-center">
              <Mail size={16} className="text-grey-11" />
              <span className="text-14 leading-6 break-all line-clamp-1 text-se-grey-48">
                {info?.email}
              </span>
            </div>
            {/* verified */}
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#16A34A]" />
          </div>
  
          {/* Phone */}
          <div className="flex items-center flex-wrap" data-test-id="user-profile__info__mobile">
            <div className="flex gap-2 items-center">
              <Smartphone size={16} className="text-grey-11" />
              <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
                {info?.primaryContact?.value ?? "Thêm số điện thoại"}
              </span>
            </div>
          </div>
  
          {/* Gender */}
          <div className="flex items-center flex-wrap" data-test-id="user-profile__info__gender">
            <div className="flex gap-2 items-center">
              <User size={16} className="text-grey-11" />
              <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
                {info?.gender ? (info?.gender === "MALE" ? "Nam" : "Nữ") : "Thêm giới tính"}
              </span>
            </div>
          </div>
  
          {/* Birthday */}
          <div className="flex items-center flex-wrap" data-test-id="user-profile__info__birthday">
            <div className="flex gap-2 items-center">
              <Cake size={16} className="text-grey-11" />
              <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
                {info?.dateOfBirth ?? "Thêm ngày sinh"}
                
              </span>
            </div>
          </div>
  
          {/* Marital */}
          <div className="flex items-center flex-wrap" data-test-id="user-profile__info__marital_status">
            <div className="flex gap-2 items-center">
              <HeartHandshake size={16} className="text-grey-11" />
              <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
                {info?.isMarried === true
                  ? "Đã có gia đình"
                  : info?.isMarried === false
                  ? "Độc thân"
                  : "Thêm tình trạng hôn nhân"
                }
              </span>
            </div>
          </div>
        </div>
  
        {/* Popup chỉnh sửa (drawer) */}
        <RightDrawer
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          title="Thông tin cá nhân"
        >
          <PersonalForm
            defaultValues={toFormDefaults(info || {})}
            onSubmit={handleUpdateInfo}
          />
        </RightDrawer>
  
      </div>
  
      <AvatarCropModal
          open={openCrop}
          onClose={()=> setOpenCrop(false)}
          src={rawAvatarSrc}
          onConfirm={handleCroppedAvatar}
      />
    </>
  );
}