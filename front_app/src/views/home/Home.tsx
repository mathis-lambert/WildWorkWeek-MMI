import {useSelector} from "react-redux";
import {SessionState} from "../../types/Types.ts";
import {useEffect} from "react";

const Home = () => {
    const session = useSelector((state: SessionState) => state.session)

    useEffect(() => {
        console.log(session)
    }, [session]);

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}

export default Home;