import { Mail, Phone, MapPin, Building } from "lucide-react";
import { useLocation } from "~/hooks/use-location";

const formatAddress = (address, provinceName = "", districtName = "") => {
  if (!address) {
    return "";
  }

  const provinceText = provinceName || address.province || address.city || "";
  const districtText = districtName || address.district || "";

  return [
    address.specific || address.street,
    address.ward,
    districtText,
    provinceText,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const normalizeContactType = (contact) =>
  String(contact?.contactType || contact?.type || "").trim().toUpperCase();

const getPrimaryContact = (contacts, type) => {
  if (!Array.isArray(contacts) || !type) {
    return null;
  }

  const normalizedType = String(type).toUpperCase();
  const byType = contacts.filter(
    (contact) => normalizeContactType(contact) === normalizedType && contact?.value
  );

  if (!byType.length) {
    return null;
  }

  return byType.find((contact) => contact?.isPrimary) || byType[0];
};

export default function CompanyInfo({ company }) {
  const { contacts, addresses } = company;

  const primaryAddress = addresses?.find(a => a.isPrimary) || addresses?.[0];
  const { provinceName, districtName } = useLocation(
    primaryAddress?.province || primaryAddress?.city || "",
    primaryAddress?.district || ""
  );
  const emailContact = getPrimaryContact(contacts, "EMAIL");
  const phoneContact = getPrimaryContact(contacts, "PHONE");
  const displayEmail = emailContact?.value || company?.email || "";

  return (
    <div className="space-y-6 mt-13">
      {/* Contact Info */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building size={20} className="text-indigo-600" />
          Thông tin liên hệ
        </h3>
        
        <div className="space-y-4">
          {primaryAddress && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Trụ sở chính</p>
                <p className="text-sm text-slate-600">
                  {formatAddress(primaryAddress, provinceName, districtName)}
                </p>
              </div>
            </div>
          )}

          {displayEmail && (
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Email</p>
                <a href={`mailto:${displayEmail}`} className="text-sm text-indigo-600 hover:underline">
                  {displayEmail}
                </a>
                {!emailContact?.value && company?.email && (
                  <p className="mt-1 text-xs text-slate-500">
                    Email này đang lấy từ tài khoản công ty do chưa cấu hình email liên hệ tuyển dụng.
                  </p>
                )}
              </div>
            </div>
          )}

          {phoneContact && (
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Điện thoại</p>
                <a href={`tel:${phoneContact.value}`} className="text-sm text-indigo-600 hover:underline">
                  {phoneContact.value}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Addresses if any */}
      {addresses?.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Văn phòng khác</h3>
          <div className="space-y-4">
            {addresses.filter(a => a !== primaryAddress).map((addr, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <MapPin size={18} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-sm text-slate-600">
                  {formatAddress(addr)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
