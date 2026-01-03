import { Mail, Phone, MapPin, Building } from "lucide-react";

export default function CompanyInfo({ company }) {
  const { contacts, addresses } = company;

  const primaryAddress = addresses?.find(a => a.isPrimary) || addresses?.[0];
  const emailContact = contacts?.find(c => c.contactType === "EMAIL");
  const phoneContact = contacts?.find(c => c.contactType === "PHONE");

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
                  {[primaryAddress.specific, primaryAddress.ward, primaryAddress.district, primaryAddress.province, primaryAddress.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}

          {emailContact && (
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Email</p>
                <a href={`mailto:${emailContact.value}`} className="text-sm text-indigo-600 hover:underline">
                  {emailContact.value}
                </a>
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
                   {[addr.specific, addr.ward, addr.district, addr.province, addr.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
