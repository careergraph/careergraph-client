import Navbar from '../../components/Navbar';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Footer from '../../components/Footer';

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
