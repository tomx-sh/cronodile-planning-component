import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";

// https://2019.wattenberger.com/blog/react-and-d3
export type TimeScale = d3.ScaleTime<number, number, never>;

interface TimeScaleState {
    timeScale: TimeScale;
    /** Visible time range */
    domain: [Date, Date];
    range: [number, number];
    /** Min date of the planning */
    minDate: Date;
    /** Max date of the planning */
    maxDate: Date;
}

interface TimeScaleContext extends TimeScaleState {
    setMinDate: React.Dispatch<React.SetStateAction<Date>>;
    setMaxDate: React.Dispatch<React.SetStateAction<Date>>;
    setDomain: React.Dispatch<React.SetStateAction<[Date, Date]>>;
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    pan: (deltaLeft: number) => void;
    zoom: ({level, centerX, centerDate}: {level: number, centerX?: number, centerDate?: Date}) => void;
    zoomLevel: number;
    setWindow: (newRange: [number, number]) => void;
}


const TimeScaleContext = createContext<TimeScaleContext | undefined>(undefined);

export function TimeScaleContextProvider({ children }: { children: React.ReactNode }) {
    const [minDate, setMinDate] = useState(new Date(2024, 0, 1));
    const [maxDate, setMaxDate] = useState(new Date(2024, 2, 2));
    const [domain, setDomain] = useState<[Date, Date]>(() => [minDate, new Date(maxDate.getFullYear(), maxDate.getMonth()+1, maxDate.getDate())]);
    const [range, setRange] = useState<[number, number]>(() => [0, 600])
    const timeScale = useMemo(() => d3.scaleTime().domain(domain).range(range), [domain, range])
    const zoomLevel = useMemo(() => getZoomLevel({domain, minDate, maxDate}), [domain, minDate, maxDate]);

    // Pan to a certain number of pixels from the start date (left)
    const pan = useCallback((deltaLeft: number) => {
        setDomain((prevDomain) => {
            const timePerPixel = (maxDate.getTime() - minDate.getTime()) / (range[1] - range[0]);
            const timeShift = deltaLeft * timePerPixel;

            const domainDelta = prevDomain[1].getTime() - prevDomain[0].getTime();

            const newDomainStart = new Date(minDate.getTime() + timeShift);
            const newDomainEnd = new Date(newDomainStart.getTime() + domainDelta);

            return [newDomainStart, newDomainEnd];
        })
    }, [minDate, maxDate, range]);
            

    // New zoom function
    // 100% zoom means the domain corresponds to the min and max dates
    // 200% zoom means the domain is half the size of the min and max dates
    const zoom = useCallback(({ level, centerDate, centerX }: { level: number; centerDate?: Date; centerX?: number }) => {
        setDomain((prevDomain) => {
            const currentZoomLevel = getZoomLevel({ domain: prevDomain, minDate, maxDate });
            const newZoomLevel = level;
            const zoomFactor = currentZoomLevel / newZoomLevel; // Corrected calculation

            const domainDelta = prevDomain[1].getTime() - prevDomain[0].getTime();

            let centerTime: number;

            if (centerDate) {
                // If centerDate is provided, use its time value
                centerTime = centerDate.getTime();
            } else if (centerX != null) {
                // If centerX is provided, map the pixel value to a date
                const timeScale = d3.scaleTime().domain(prevDomain).range(range);
                centerTime = timeScale.invert(centerX).getTime();
            } else {
                // Default to the center of the current domain
                centerTime = prevDomain[0].getTime() + domainDelta / 2;
            }

            // Calculate the position of the centerTime within the current domain (0 to 1)
            const center = (centerTime - prevDomain[0].getTime()) / domainDelta;

            const newDomainDelta = domainDelta * zoomFactor;
            const newDomainStart = new Date(centerTime - newDomainDelta * center);
            const newDomainEnd = new Date(centerTime + newDomainDelta * (1 - center));

            return [newDomainStart, newDomainEnd];
        });
    },[setDomain, minDate, maxDate, range]);


    // TODO: A reducer would be easier for this hook
    /** Change the range without stretching the dates */
    const setWindow = useCallback((newRange: [number, number]) => {
        setRange((prevRange) => {
            setDomain((prevDomain) => {

                const deltaXStart = (newRange[0] - prevRange[0]);
                const deltaXEnd   = (newRange[1] - prevRange[1]);

                const prevTimeSpan = prevDomain[1].getTime() - prevDomain[0].getTime();
                const prevRangeSpan = prevRange[1] - prevRange[0];

                const timePerPixel = Math.max(prevTimeSpan/(2*prevRangeSpan), 1);

                const startTimeShift = Math.floor((deltaXStart * timePerPixel));
                const endTimeShift   = Math.floor((deltaXEnd   * timePerPixel));

                const newDomain: [Date, Date] = [
                    new Date(prevDomain[0].getTime() + startTimeShift),
                    new Date(prevDomain[1].getTime() + endTimeShift),
                ];

                return newDomain;
            });

            return newRange;
        });
    }, [setDomain, setRange]);



    return (
        <TimeScaleContext.Provider value={{timeScale, minDate, maxDate, setMinDate, setMaxDate, domain, range, setDomain, setRange, pan, zoom, zoomLevel, setWindow}}>
            {children}
        </TimeScaleContext.Provider>
    )
}


export function useTimeScale() {
    const context = useContext(TimeScaleContext);
    if (!context) { throw new Error("useScale must be used within a TimeScaleContextProvider")}
    return context;
}



function getZoomLevel({domain, minDate, maxDate}: {domain: [Date, Date], minDate: Date, maxDate: Date}) {
    const domainDelta = domain[1].getTime() - domain[0].getTime();
    const minMaxDatesDelta = maxDate.getTime() - minDate.getTime();
    return (minMaxDatesDelta / domainDelta) * 100
}