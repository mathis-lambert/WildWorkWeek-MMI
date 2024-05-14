// import {useSelector} from "react-redux";
// import {SessionState} from "../../types/Types.ts";
// import {useEffect} from "react";
import ProfilCard from "../../components/ProfilCard/ProfilCard.tsx";
import "./Home.scss";
import Artefact from "../../components/Artefact/Artefact.tsx";

const Home = () => {

    return (
        <div className={"home"}>
            <ProfilCard/>
            <div className="separator"></div>
            <Artefact/>
        </div>
    );
}

export default Home;