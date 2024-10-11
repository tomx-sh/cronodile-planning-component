import { useCronoLayout } from "../CronoLayout"
import { useTimeTicksState } from "./useTimeTicksState";
import { useMemo, useEffect } from "react";
import makeStandardTicks from "./standardTicksFactory";
import { overlaps } from "./standardTicksFactory";
import { useTimeScale } from "../../hooks/useTimeScale";


export default function TimeTicks() {
    const { horizontalY, verticalX } = useCronoLayout()
    const { showDays, setShowDays, showWeeks, setShowWeeks, showMonths, setShowMonths, showYears, setShowYears } = useTimeTicksState()
    const { timeScale } = useTimeScale()

    // The ticks are stacked on top of each other, from bottom to top: days, weeks, months, years.
    // If any of those four is not displayed, the ticks are shifted down to fill the gap.
    // Constants
    const ticksTextMargin = 5; // Around the text
    const fontSizeDays = 8;
    const fontSizeWeeks = 10;
    const fontSizeMonths = 12;
    const fontSizeYears = 14;
    const fontFamily = 'Arial';

    const { daysPosition, weeksPosition, monthsPosition, yearsPosition } = useMemo(() => {
        // Initialize positions
        let currentPosition = 10;

        let daysPosition = 0;
        let weeksPosition = 0;
        let monthsPosition = 0;
        let yearsPosition = 0;

        if (showDays) {
            daysPosition = currentPosition;
            currentPosition += fontSizeDays + ticksTextMargin;
        }

        if (showWeeks) {
            weeksPosition = currentPosition;
            currentPosition += fontSizeWeeks + ticksTextMargin;
        }

        if (showMonths) {
            monthsPosition = currentPosition;
            currentPosition += fontSizeMonths + ticksTextMargin;
        }

        if (showYears) {
            yearsPosition = currentPosition;
            currentPosition += fontSizeYears + ticksTextMargin;
        }

        return { daysPosition, weeksPosition, monthsPosition, yearsPosition };
    }, [showDays, showWeeks, showMonths, showYears]);


    const { daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize } = useMemo(() => {
        const strokesIds = ['days', 'weeks', 'months', 'years'];
        const show = [showDays, showWeeks, showMonths, showYears];

        // Keep only the strokes that are displayed, thanks to the mask
        const displayedStrokes = strokesIds.filter((_, i) => show[i]); // Now they are ordered with a useful index

        const [daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize] = strokesIds.map((id, i) => {
            // If hidden, return 0
            if (!show[i]) return 0

            // If displayed, return the size
            const reducedIndex = displayedStrokes.indexOf(id);
            return reducedIndex + 1; // This is a simple linear scale
        })

        return { daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize };
    }, [showDays, showWeeks, showMonths, showYears]);


    // Depending on the date range, the ticks can be too close to each other.
    // In this case, we should hide them.
    useEffect(() => {
        requestAnimationFrame(() => {
            const daysOverlap = overlaps({type: 'days', timeScale, margin: ticksTextMargin, fontSize: fontSizeDays, fontFamily})
            setShowDays(!daysOverlap);

            const weelsOverlap = overlaps({type: 'weeks', timeScale, margin: ticksTextMargin, fontSize: fontSizeWeeks, fontFamily})
            setShowWeeks(!weelsOverlap);

            const monthsOverlap = overlaps({type: 'months', timeScale, margin: ticksTextMargin, fontSize: fontSizeMonths, fontFamily})
            setShowMonths(!monthsOverlap);

            const yearsOverlap = overlaps({type: 'years', timeScale, margin: ticksTextMargin, fontSize: fontSizeYears, fontFamily})
            setShowYears(!yearsOverlap);
        })
    }, [timeScale, setShowDays, setShowWeeks, setShowMonths, setShowYears]);


    const DaysTicks = makeStandardTicks({type: 'days', timeScale})
    const WeeksTicks = makeStandardTicks({type: 'weeks', timeScale})
    const MonthsTicks = makeStandardTicks({type: 'months', timeScale})
    const YearsTicks = makeStandardTicks({type: 'years', timeScale})

    return (
        <g transform={`translate(${verticalX}, ${horizontalY})`}>
            {/*<line x1={0} x2={width-verticalX-rightMargin} y1={0} y2={0} stroke="lightgrey" strokeWidth={1} opacity={0.2}/>*/}

            {showDays   && <DaysTicks textSize={fontSizeDays} height={daysPosition} margin={ticksTextMargin} strokeWidth={daysStrokeSize} />}
            {showWeeks  && <WeeksTicks textSize={fontSizeWeeks} height={weeksPosition} margin={ticksTextMargin} strokeWidth={weeksStrokeSize} />}
            {showMonths && <MonthsTicks textSize={fontSizeMonths} height={monthsPosition} margin={ticksTextMargin} strokeWidth={monthsStrokeSize} />}
            {showYears  && <YearsTicks textSize={fontSizeYears} height={yearsPosition} margin={ticksTextMargin} strokeWidth={yearsStrokeSize} />}
        </g>
    )
}
