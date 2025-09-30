import { Link } from "react-router-dom";
import { navLinks } from "../../../data/navLinks";
import logoSvg from "../../../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full text-slate-500">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 pb-6">
        <div className="md:max-w-114">
          <div className="flex items-center justify-items-center gap-2">
            <img
              className="h-9 md:h-9.5 w-auto shrink-0"
              src={logoSvg}
              alt="Logo"
              width={140}
              height={40}
              fetchPriority="high"
            />
            <div className="font-bold text-xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </div>
          </div>
          <p className="mt-6">
            Launch your career or find top talent with our AI-driven job search
            platform, built for speed, precision, and growth. Whether you're a
            job seeker or employer, our tools—ATS matching, CV templates, career
            blogs, and Google integrations—streamline your journey in a
            professional, user-friendly environment.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="hover:text-indigo-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
            <div className="space-y-2">
              <p>0976870127</p>
              <p>congquynguyen296@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center pb-5">
        Copyright 2025 © HCMUTE. All Right Reserved.
      </p>
    </footer>
  );
}
