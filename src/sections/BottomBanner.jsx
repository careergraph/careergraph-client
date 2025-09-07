import { GithubIcon } from "lucide-react";

export default function BottomBanner() {
    return (
        <div className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto mt-28 px-16">
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-20 -mt-10 -mb-10 w-full">
                <p className="text-xl font-medium max-w-sm">Join hundreds of developers building better SaaS products.</p>
                <button className="flex items-center gap-2 rounded-md py-3 px-5 bg-indigo-600 hover:bg-indigo-700 transition text-white">
                    <GithubIcon size={20} />
                    <span>Star on Github</span>
                </button>
            </div>
        </div>
    );
}