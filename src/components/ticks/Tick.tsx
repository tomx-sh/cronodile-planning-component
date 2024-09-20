'use client'
import { useCronoLayout } from "../CronoLayout"
import { useCanvas } from "../Canvas"


interface TickProps {
    tickHeight: number;
    text: string;
    margin?: number;
    textSize?: number;
    strokeWidth?: number;
    strokeColor?: string;
    textColor?: string;
    font?: string;
}


export default function Tick({ 
    tickHeight,
    text,
    margin = 3,
    textSize = 10,
    strokeWidth = 1,
    strokeColor = 'black',
    textColor = 'black',
    font = 'Arial',
}: TickProps) {

    const { height } = useCanvas();
    const { horizontalY } = useCronoLayout()

    // TODO: position text from baseline and use font size for the tick height

    return (
        <g>
            <line y1={-tickHeight} y2={height - horizontalY} stroke={strokeColor} strokeWidth={strokeWidth} />
            <text x={margin} y={-tickHeight} textAnchor="start" alignmentBaseline="hanging" fill={textColor} fontSize={textSize} fontFamily={font}>
                {text}
            </text>
        </g>
    )
}