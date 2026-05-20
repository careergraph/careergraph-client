import Navbar from "../../layouts/components/Navbar/Navbar";
import Footer from "../../layouts/components/Footer/Footer";
import ChatBotButton from "~/components/Buttons/ChatBotButton";
import BottomNav from "~/components/BottomNav/BottomNav";
import { useLocation } from "react-router-dom";



function DefaultLayout({ children }) {
    const { pathname } = useLocation();
    const isMessagesPage = pathname.startsWith("/messages");
    const showBottomNav = true;

    return (
        <div className="min-h-dvh bg-slate-50">
            <Navbar />
            <div className={isMessagesPage ? "px-4 md:px-16 pt-[4.5rem]" : "px-4 md:px-16 pt-25"}>
                <div className={`${isMessagesPage ? "h-[calc(100dvh-6.5rem)] min-h-0" : ""} ${showBottomNav ? "has-bottom-nav" : ""}`}>
                    {children}
                </div>
            </div>
            {!isMessagesPage ? <Footer /> : null}
            {!isMessagesPage ? <ChatBotButton /> : null}
            {showBottomNav ? <BottomNav /> : null}
        </div>
    );
}
export default DefaultLayout;