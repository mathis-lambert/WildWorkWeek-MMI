import './LocationCTA.scss';

interface LocationCTAProps {
    className?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    onClick: () => void;
}

const LocationCTA = (props: LocationCTAProps) => {
    return (
        <div
            className={"location-cta" + (props.className ? ` ${props.className}` : "")}
            style={{
                top: `${props.top}%`,
                left: `${props.left}%`,
                width: `${props.width}%`,
                height: `${props.height}%`
            }}
            onClick={props.onClick}
        >
        </div>
    );
}

export default LocationCTA;