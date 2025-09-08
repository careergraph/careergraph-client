import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";



function DefaultLayout({children}) {
    return ( 
        <div>
            <Navbar/>
            <div className="md:px-16 lg:px-24 xl:px-32">
                <div>{children}</div>  
            </div>
            <Footer />
        </div>
        );
}


export default DefaultLayout;