import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  // eslint-disable-next-line no-unused-vars
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
      >
        <Bell size={22} />
        {/* Badge số thông báo (nếu có) */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown thông báo - sẽ load sau */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              <div>
                {/* Danh sách thông báo sẽ được load ở đây */}
                {notifications.map((notification, index) => (
                  <div 
                    key={index}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 ${
                      !notification.isRead ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
