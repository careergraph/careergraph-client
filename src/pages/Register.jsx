import aiFeatureLogin from "../assets/icons/ai-feature.svg";

export default function Register() {
  return (
    <div className="flex h-[700px] w-full gap-30">
      <div className="w-1/2 hidden md:flex justify-end items-center">
        <img
          className="object-contain max-h-[600px] w-auto"
          src={aiFeatureLogin}
          alt="rightSideImage"
        />
      </div>

      <div className="w-1/2 flex flex-col items-start justify-center">
        <form className="md:w-96 w-80 flex flex-col">
          <h2 className="text-xl text-gray-900 font-medium">
            Create your{"  "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>{"  "}
            account
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Join us today! Please fill in the details to sign up.
          </p>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full font-bold text-white bg-pink-500 hover:opacity-90 transition-opacity"
          >
            Sign up
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <a className="text-indigo-400 hover:underline" href="/login">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
