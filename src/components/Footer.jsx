import { Link } from "react-router-dom";
import { navLinks } from "../data/navLinks";

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full text-slate-500">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 pb-6">
                <div className="md:max-w-114">
                    <img className="h-9 md:h-9.5 w-auto shrink-0" src="/assets/logo.svg" alt="Logo" width={140} height={40} fetchPriority="high" />
                    <p className="mt-6">
                        Launch your SaaS product in record time with our all-in-one platform designed for speed, flexibility and growth. Whether you`&apos;re a solo founder or a fast-moving team, we provide everything you need.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-indigo-600">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="space-y-2">
                            <p>+1-212-456-7890</p>
                            <p>contact@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright 2024 © <a href="https://prebuiltui.com">PrebuiltUI</a>. All Right Reserved.
            </p>
        </footer>
    );
};