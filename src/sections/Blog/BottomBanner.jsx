import { GithubIcon } from "lucide-react";
import ViewJobButton from "../../components/Buttons/ViewJobButton";

export default function BottomBanner() {
  return (
    <div className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto mt-28 px-16">
      <div className="flex md:flex-row flex-col border border-indigo-500/30 rounded-lg items-start md:items-center justify-between gap-5 text-sm max-w-5xl bg-white p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-semibold text-gray-700">
            Đăng ký nhận bản tin của chúng tôi
          </h1>

          <p className="text-gray-500 mt-2">
            Nhận thông tin về việc làm mới nhất, cẩm nang nghề nghiệp và các cơ hội phát triển sự nghiệp.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <input
              className="py-2 px-3 w-full outline-none focus:border-indigo-500/60 transition max-w-64 border border-gray-500/30 rounded-md"
              type="text"
              placeholder="Nhập email của bạn"
            />

            <ViewJobButton label="Gửi" />
          </div>
        </div>

        <div className="space-y-4 md:max-w-48">
          <div className="flex items-center gap-3">
            <div className="bg-gray-500/10 w-max p-2.5 rounded">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 20.167H9.167c-3.457 0-5.186 0-6.26-1.074s-1.074-2.802-1.074-6.26V11c0-3.457 0-5.185 1.074-6.26 1.074-1.073 2.803-1.073 6.26-1.073h3.667c3.456 0 5.185 0 6.259 1.074s1.074 2.802 1.074 6.26v1.833c0 3.457 0 5.185-1.074 6.259-.599.599-1.401.864-2.593.981M6.417 3.667V2.292m9.167 1.375V2.292m4.125 5.958H9.854m-8.02 0h3.552"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="text-base font-medium text-gray-800">
              Bài viết hàng tuần
            </h3>
          </div>

          <p className="text-gray-500">
            Nhận các bài viết chuyên sâu về nghề nghiệp, kỹ năng và xu hướng thị trường lao động.
          </p>
        </div>

        <div className="space-y-4 md:max-w-48">
          <div className="flex items-center gap-3">
            <div className="bg-gray-500/10 w-max p-2.5 rounded">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 3.208v6.875-5.958a1.375 1.375 0 1 1 2.75 0v5.958-3.208a1.375 1.375 0 1 1 2.75 0v7.791a5.5 5.5 0 0 1-5.5 5.5H11.8a5.5 5.5 0 0 1-3.76-1.486l-4.546-4.261a1.594 1.594 0 1 1 2.218-2.291l1.623 1.623V5.958a1.375 1.375 0 1 1 2.75 0v4.125-6.875a1.375 1.375 0 1 1 2.75 0"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-base font-medium text-gray-800">Không spam</h3>
          </div>

          <p className="text-gray-500">
            Chúng tôi cam kết không gửi thư rác. Chỉ những thông tin hữu ích và liên quan đến sự nghiệp của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
