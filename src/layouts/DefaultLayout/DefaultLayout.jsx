import Navbar from "../../layouts/components/Navbar/Navbar";
import Footer from "../../layouts/components/Footer/Footer";
import ChatBotButton from "~/components/Buttons/ChatBotButton";



function DefaultLayout({children}) {
    return ( 
        <div>
            <Navbar/>
            <div className="md:px-16  pt-25 bg-slate-50">
                <div>{children}</div>  
            </div>
            <Footer />
            <ChatBotButton />
        </div>
        );
}
export default DefaultLayout;