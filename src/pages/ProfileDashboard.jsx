import { Heart } from "lucide-react";
import SideBar from "~/components/ProfileDashboard/SideBar";



export default function ProfileDashboard(){
  const jobs = [
    {
      title: "Nhân Viên Hành Chính Nhân Sự",
      company: "Công Ty Cổ Phần Đầu Tư Xây Dựng Gia Thắng",
      salary: "8 - 12 triệu",
      location: "TP.HCM",
      time: "Còn 16 ngày",
    },
    {
      title: "Nhân Viên Tư Vấn Bán Hàng",
      company: "Công Ty TNHH Space Art",
      salary: "4 - 8 triệu",
      location: "TP.HCM",
      time: "Còn 2 ngày",
    },
    {
      title: "Tài Xế Lái Xe Cho Sếp",
      company: "Công Ty TNHH Cơ Khí Happyco",
      salary: "9 - 15 triệu",
      location: "Bình Dương",
      time: "Còn 7 ngày",
    },
  ];

  


  return (
      <aside className="flex-1 bg-white shadow  space-y-4">
        <h3 className="font-semibold text-lg">Việc làm gợi ý cho bạn</h3>
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 hover:shadow transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-slate-800">{job.title}</h4>
                <p className="text-sm text-slate-600">{job.company}</p>
              </div>
              <button className="text-slate-400 hover:text-red-500">
                <Heart size={18} />
              </button>
            </div>
            <p className="text-sm text-indigo-600 font-medium mt-1">{job.salary}</p>
            <p className="text-sm text-slate-600">{job.location}</p>
            <p className="text-xs text-slate-500">{job.time}</p>
          </div>
        ))}
      </aside>
  );
}
