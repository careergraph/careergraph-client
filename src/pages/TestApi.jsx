import { useEffect, useState } from "react";
import { JobService } from "~/services/jobService";

export default function TestApiPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log("🧪 Test: Bắt đầu test API");
        
        // Test với ID từ ví dụ của bạn
        const jobId = "7a430bd1-95cd-4ee0-9ae8-f461a8487be6";
        
        const data = await JobService.fetchJobDetail(jobId);
        
        console.log("✅ Test: Kết quả:", data);
        setResult(data);
      } catch (err) {
        console.error("❌ Test: Lỗi:", err);
        setError(err.message);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test API Get Job Detail</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Endpoint:</h2>
        <code className="bg-gray-100 px-2 py-1 rounded">
          GET http://localhost:8080/careergraph/api/v1/jobs/7a430bd1-95cd-4ee0-9ae8-f461a8487be6
        </code>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <h3 className="text-red-800 font-semibold">❌ Lỗi:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
          <h3 className="text-green-800 font-semibold">✅ Thành công!</h3>
          <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {!result && !error && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <p className="text-blue-800">🔄 Đang gọi API...</p>
          <p className="text-sm text-blue-600 mt-2">
            Mở Console (F12) để xem chi tiết logging
          </p>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
        <h3 className="font-semibold text-yellow-800">💡 Hướng dẫn Debug:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1 mt-2">
          <li>Mở Console (F12)</li>
          <li>Tìm các log có emoji 🔍 📦 🌐 ✅ ❌</li>
          <li>Kiểm tra xem Backend có đang chạy tại localhost:8080 không</li>
          <li>Kiểm tra response structure từ API</li>
          <li>Kiểm tra CORS settings nếu cần</li>
        </ol>
      </div>
    </div>
  );
}
