import './ProfilCard.scss'
import {useSelector} from "react-redux";
import {SessionState} from "../../types/Types.ts";
import {Link} from "react-router-dom";

const ProfilCard = () => {
    const session = useSelector((state: SessionState) => state.session);
    return (
        <div className={"profil-card"}>
            <div className="profil-card__avatar">
                {/*<img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar"/>*/}
            </div>
            <div className="profil-card__infos">
                <h2>{session.user_firstname}&nbsp;{session.user_lastname}</h2>
            </div>
            <div className="profil-card__inventory">
                <div className={"item"}>
                    <div className="icon"></div>
                    <span>MON ARME</span>
                </div>
                <div className={"item"}>
                    <div className="icon"></div>
                    <span>MON COMPAGNON</span>
                </div>
                <div className={"item"}>
                    <div className="icon"></div>
                    <span>MON GARDIEN</span>
                </div>
            </div>
            <Link to={"/game"} className="profil-card__button">COMMENCER</Link>
        </div>
    );
}

export default ProfilCard;