import {useOutlet} from "react-router-dom";
import Navbar from "../../Nav/Navbar.tsx";

const Layout = () => {
    const outlet = useOutlet();

    return (
        <>
            <Navbar/>
            {outlet}
        </>
    );
}

export default Layout;