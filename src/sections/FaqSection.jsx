import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { faqsData } from "../data/faqsData";

export const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center px-4 md:px-0">
            <SectionTitle text1="FAQ's" text2="Frequently asked questions" text3="Ship Beautiful Frontends Without the Overhead — Customizable, Scalable, and Developer-Friendly UI Components." />
            <div className="mt-8">
                {faqsData.map((faq, index) => (
                    <div className="border-b border-slate-200 py-4 cursor-pointer w-full" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">
                                {faq.question}
                            </h3>
                            <ChevronDown size={18} className={`${openIndex === index && "rotate-180"} transition-all duration-500 ease-in-out`} />
                        </div>
                        <p className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-xl ${openIndex === index ? "opacity-100 max-h-[500px] translate-y-0 pt-4" : "opacity-0 max-h-0 overflow-hidden -translate-y-2"}`} >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};