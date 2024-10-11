import Tick from "./Tick"

export interface RegularTicksProps {
    ticksX: number[];
    ticksText: string[];
    textSize: number;
    height: number;
    margin: number;
    strokeWidth: number;
}


export default function RegularTicks({ticksX, ticksText, textSize, height, margin, strokeWidth}: RegularTicksProps) {
    return (
        <g>
            {ticksX.map((x, i) => (
                <g transform={`translate(${x}, 0)`} key={i}>
                    <Tick key={i} text={ticksText[i]} textSize={textSize} tickHeight={height} margin={margin} strokeWidth={strokeWidth} />
                </g>
            ))}
        </g>
    )
}