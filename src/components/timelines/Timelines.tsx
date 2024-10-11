import { useCronoLayout } from "../CronoLayout";
import { useCanvas } from "../Canvas";
import { useVerticalScale } from "../../hooks/useVerticalScale";




export default function Timelines() {
    const {verticalScale} = useVerticalScale();

    const timelines = [{id: "1"}, {id: "2"}, {id: "3"}, {id: "4"}, {id: "5"}];


    const {horizontalY, verticalX} = useCronoLayout();
    const {width, height} = useCanvas();

    const _timelines = timelines.map((timeline, i) => {
        return {
            id: timeline.id,
            y: verticalScale(i)
        }
    })

    const timelinesProps = {
        xStart: verticalX,
        xEnd: width,
        yStart: horizontalY,
        yEnd: height,
        timelines: _timelines
    }

    return (
        <TimelinesView {...timelinesProps} />
    )
}







interface TimelinesViewProps {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
    timelines: {id:string, y: number}[],
}


function TimelinesView({xStart, xEnd, yStart, yEnd, timelines}: TimelinesViewProps) {
  return (
    <g>
        {timelines.map((timeline, i) => {
            if (timeline.y < yStart || timeline.y > yEnd) return null;
            return (
                <line x1={xStart} x2={xEnd} y1={timeline.y} y2={timeline.y} key={timeline.id} stroke='lightgray' strokeWidth={1}/>
            )
        })}
    </g>
  );
}