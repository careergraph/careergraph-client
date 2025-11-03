import Container from "../Containers/Container";

export default function UserInfoLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Container className="flex flex-col items-center gap-4 text-center">
        <span
          className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"
          aria-hidden="true"
        />
        <p className="text-base font-medium text-slate-700" aria-live="polite">
          Đang tải thông tin người dùng...
        </p>
        <p className="text-sm text-slate-500">Vui lòng đợi trong giây lát.</p>
      </Container>
    </div>
  );
}
