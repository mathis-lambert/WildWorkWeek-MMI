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
                    <div className="icon">
                        {session.user_weapon === "gant" && <img src="/images/objets-magiques/gant.png" alt="gant"/>}
                        {session.user_weapon === "lunettes" && <img src="/images/objets-magiques/glasses.png" alt="epee"/>}
                        {session.user_weapon === "bague" && <img src="/images/objets-magiques/bague.png" alt="bague"/>}
                    </div>
                    <span>MON ARME</span>
                </div>
                <div className={"item"}>
                    <div className="icon">
                        {session.user_companion === "maugy" && <img src="/images/companions/compagnon_crea.png" alt="maugy"/>}
                        {session.user_companion === "ploucou" && <img src="/images/companions/compagnon_com.png" alt="ploucou"/>}
                        {session.user_companion === "jada" && <img src="/images/companions/compagnon_dev.png" alt="jada"/>}
                    </div>
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