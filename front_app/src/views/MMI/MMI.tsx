import './MMI.scss';
import {Link} from "react-router-dom";

const MMI = () => {
    return (
        <div className={"mmi"}>
            <div className="container">
                <div className="artefact">
                    <img src="/images/artefact/main.png" alt="artefact"/>
                </div>
                <h2>MMI C'est quoi ?</h2>
                <p>
                    La formation BUT MMI (Métiers du Multimédia et de l'Internet) est un programme d'études de trois ans
                    après le baccalauréat, centré sur les domaines de la création numérique, du web et de la
                    communication. Elle offre aux étudiants une formation polyvalente couvrant des aspects techniques
                    tels que le développement web, le design graphique et la production audiovisuelle, ainsi que des
                    compétences en communication et en marketing digital. Cette formation vise à préparer les étudiants
                    à intégrer le monde professionnel dans des secteurs variés tels que la conception de sites web, la
                    gestion de projets numériques, le community management ou encore la création de contenus
                    multimédias.
                </p>
                <h2>Les différents parcours</h2>
                <div className="mmi-cards">
                    <div className="mmi-card">
                        <h3>Développement Web</h3>
                        <p>
                            Ce parcours met l'accent sur l'apprentissage des langages de programmation et des outils
                            nécessaires à la création et au développement de sites web fonctionnels et esthétiques. Les
                            étudiants acquièrent des compétences en HTML, CSS, JavaScript, ainsi qu'en frameworks et CMS
                            (Content Management System) populaires tels que WordPress ou Joomla.
                        </p>
                    </div>
                    <div className="mmi-card">
                        <h3>Design Graphique</h3>
                        <p>
                            Axé sur le design et la production multimédia, ce parcours forme les étudiants à utiliser
                            des logiciels de création graphique, de montage vidéo et d'animation. Les compétences en
                            design graphique, en traitement d'image et en animation 2D/3D sont au cœur de cette
                            spécialisation.
                        </p>
                    </div>
                    <div className="mmi-card">
                        <h3>Production Audiovisuelle</h3>
                        <p>
                            Ce parcours se concentre sur les aspects stratégiques et créatifs de la communication
                            digitale. Les étudiants développent des compétences en marketing digital, en rédaction web
                            et en community management. Ils apprennent également à analyser les tendances du marché et à
                            mettre en œuvre des stratégies de communication efficaces sur les plateformes numériques.
                        </p>
                    </div>
                </div>
                <h2>Quelles sont les débouchés ?</h2>
                <p>
                    Les diplômés en MMI ont un large éventail de débouchés professionnels dans les domaines du
                    numérique, de la communication et du multimédia. Ils peuvent devenir des développeurs web, concevant
                    et créant des sites et des applications interactives. Certains se dirigent vers le design graphique,
                    où ils imaginent des visuels attrayants pour le web et d'autres supports. D'autres encore
                    choisissent des rôles de communication digitale, gérant la présence en ligne d'entreprises ou
                    d'organisations via les réseaux sociaux et d'autres canaux numériques.
                    <br/>
                    <br/>
                    Certains diplômés MMI s'orientent vers des postes de chef de projet multimédia, coordonnant la
                    réalisation de projets numériques complexes. D'autres se spécialisent dans la gestion de communautés
                    en ligne en tant que community managers, tandis que certains optent pour des carrières de
                    consultants en marketing digital, conseillant les entreprises sur leurs stratégies de présence en
                    ligne.
                    <br/>
                    <br/>
                    Les possibilités de carrière incluent également des rôles techniques, tels que technicien en
                    audiovisuel pour la production et la diffusion de contenus, ainsi que des postes de gestion de sites
                    web en tant que webmasters. Ces débouchés offrent aux diplômés en MMI un terrain fertile pour mettre
                    en valeur leurs compétences techniques, leur créativité et leur compréhension approfondie du monde
                    numérique en constante évolution.
                </p>
                <h2>Est ce que MMI est fait pour moi ?</h2>
                <p>
                    Si tu aimes le multimedia sous toutes ses facettes, alors MMI est sûrement fait pour toi ! Mais pour en être sûr, pourquoi ne pas jouer le jeu et découvrir par toi-même ?
                </p>
                <Link to={"/"} className={"btn"}>Jouer</Link>
            </div>
        </div>
    );
}

export default MMI;