// src/domain/candidate/profile.mapper.js

// Chuẩn hoá data BE trả về (CandidateProfileResponse)
// thành object FE dùng trong state `info`.
export function normalizeInfoFromResponse(data) {
  if (!data) return null;

  return {
    candidateId: data.candidateId,

    firstName: data.firstName || "",
    lastName: data.lastName || "",

    email: data.email || "",

    gender: data.gender || null, // "MALE" | "FEMALE" | null
    dateOfBirth: data.dateOfBirth || "",

    isMarried: Boolean(data.isMarried),

    phone:
      data.primaryContact &&
      data.primaryContact.type === "PHONE"
        ? data.primaryContact.value || ""
        : "",

    province: data.primaryAddress?.province || "",
    district: data.primaryAddress?.district || "",
    ward: data.primaryAddress?.ward || "",
    country: data.primaryAddress?.country || "",

    // tiện cho hiển thị address string
    address:
      [
        data.primaryAddress?.district,
        data.primaryAddress?.province,
      ]
        .filter(Boolean)
        .join(", ") || "",
  };
}

// Chuẩn hoá state info (đang lưu trong FE) -> set default cho form edit
// để <PersonalForm defaultValues={...} />
export function toFormDefaults(info) {
  if (!info) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      province: "",
      district: "",
      birth: "",
      gender: "",
      marital: "Độc thân",
    };
  }

  return {
    firstName: info.firstName || "",
    lastName: info.lastName || "",
    email: info.email || "",
    phone: info.phone || "",
    province: info.province || "",
    district: info.district || "",
    birth: (info.dateOfBirth || "").slice(0, 10), // "YYYY-MM-DD"
    gender:
      info.gender === "MALE"
        ? "Nam"
        : info.gender === "FEMALE"
        ? "Nữ"
        : "",
    marital: info.isMarried ? "Đã lập gia đình" : "Độc thân",
  };
}

// Chuẩn hoá form submit -> payload gửi BE (UpdateInformationRequest)
export function toPayload(formValues) {
  return {
    firstName: formValues.firstName?.trim(),
    lastName: formValues.lastName?.trim(),

    gender:
      formValues.gender === "Nam"
        ? "MALE"
        : formValues.gender === "Nữ"
        ? "FEMALE"
        : null,

    dateOfBirth: formValues.birth || null,
    isMarried: formValues.marital === "Đã lập gia đình",

    contact: {
      type: "PHONE",
      value: formValues.phone?.trim(),
      isPrimary: true,
    },

    address: {
      country: "VN",
      province: formValues.province || "",
      district: formValues.district || "",
      // ward: formValues.ward || "",
      isPrimary: true,
    },
  };
}
