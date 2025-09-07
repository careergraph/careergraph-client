import { SparklesIcon } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { pricingData } from "../data/pricingData";

export default function Pricing() {
    return (
        <>
            <SectionTitle text1="Pricing" text2="Our Pricing Plans" text3="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up." />

            <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
                {pricingData.map((plan, index) => (
                    <div key={index} className={`p-6 rounded-2xl max-w-75 w-full shadow-[0px_4px_26px] shadow-black/6 ${plan.mostPopular ? "relative pt-12 bg-gradient-to-b from-indigo-600 to-violet-600" : "bg-white"}`}>
                        {plan.mostPopular && (
                            <div className="flex items-center text-xs gap-1 py-1.5 px-2 text-indigo-600 absolute top-4 right-4 rounded bg-white font-medium">
                                <SparklesIcon size={14} />
                                <p>Most Popular</p>
                            </div>
                        )}
                        <p className={plan.mostPopular && "text-white"}>{plan.title}</p>
                        <h4 className={`text-3xl font-semibold mt-1 ${plan.mostPopular && "text-white"}`}>${plan.price}<span className={`font-normal text-sm ${plan.mostPopular ? "text-white" : "text-slate-500"}`}>/mo</span></h4>
                        <hr className="border-slate-200 my-8" />
                        <div className={`space-y-2 ${plan.mostPopular ? "text-white" : "text-slate-500"}`}>
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <feature.icon size={18} className={`${plan.mostPopular ? "text-white" : "text-indigo-600"}`} />
                                    <span>{feature.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className={`transition w-full py-3 rounded-lg font-medium mt-8 ${plan.mostPopular ? "bg-white hover:bg-slate-100 text-slate-800" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                            <span>{plan.buttonText}</span>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}