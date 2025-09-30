import Navbar from "../../layouts/components/Navbar/Navbar";
import Footer from "../../layouts/components/Footer/Footer";



function DefaultLayout({children}) {
    return ( 
        <div>
            <Navbar/>
            <div className="md:px-16 lg:px-24 xl:px-32 pt-25">
                <div>{children}</div>  
            </div>
            <Footer />
        </div>
        );
}


export default DefaultLayout;