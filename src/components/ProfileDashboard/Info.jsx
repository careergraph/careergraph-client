function Info() {
  return ( 
    <main className="flex-2 p-6 space-y-6">
        {/* Hồ sơ */}
        <section className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Hồ sơ của tôi</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200"></div>
            <div>
              <p className="font-medium">Thịnh Lương Quang</p>
              <p className="text-sm text-slate-600">quangthinh06112004@gmail.com ✅</p>
              <button className="text-indigo-600 text-sm mt-1">
                Thêm địa chỉ, số điện thoại...
              </button>
            </div>
          </div>
        </section>

        {/* CV */}
        <section className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-3">CV của tôi</h3>
          <div className="flex items-center justify-between border rounded p-2">
            <span className="text-sm">InternJava_LuongQuangThinh.pdf</span>
            <a href="#" className="text-indigo-600 text-sm">Xem hồ sơ</a>
          </div>
          <button className="mt-3 w-full border rounded py-2 text-sm text-slate-600">
            📤 Tải lên CV có sẵn
          </button>
        </section>

        {/* Tiêu chí tìm việc */}
        <section className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Tiêu chí tìm việc</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <span>Vị trí công việc: <button className="text-indigo-600">Thêm</button></span>
            <span>Mức lương: <button className="text-indigo-600">Thêm</button></span>
            <span>Ngành nghề: <button className="text-indigo-600">Thêm</button></span>
            <span>Hình thức: <button className="text-indigo-600">Thêm</button></span>
          </div>
        </section>
      </main>

  );
}
export default Info;