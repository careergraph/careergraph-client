import aiFeatureLogin from "~/assets/icons/ai-feature.svg";

export default function AuthSplitLayout({ children }) {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center gap-10">
        <div className="hidden flex-1 justify-end lg:flex">
          <img
            src={aiFeatureLogin}
            alt="Career Graph illustration"
            className="h-auto max-h-[600px] w-full max-w-[560px] object-contain"
          />
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
