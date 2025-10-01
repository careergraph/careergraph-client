import Navbar from '../../layouts/components/Navbar/Navbar';
import Breadcrumbs from '../../components/Navigate/Breadcrumbs';
import Footer from '../../layouts/components/Footer/Footer';

function SubLayout({ children }) {
    return (
        <div>
            <Navbar />
            <Breadcrumbs/>
            <div className='md:px-16 lg:px-24 xl:px-32'>
                <div>{children}</div>
            </div>
            <Footer/>
        </div>
    );
}

export default SubLayout;
