import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";


export type VerticalScale = d3.ScaleContinuousNumeric<number, number, never>;


interface VerticalScaleState {
    verticalScale: VerticalScale;
    /** Visible timelines */
    domain: [number, number];
    /** Pixel positions */
    range: [number, number];
    /** How many timelines exist */
    numberOfTimelines: number;
}

interface VerticalScaleContext extends VerticalScaleState {
    setDomain: React.Dispatch<React.SetStateAction<[number, number]>>;
    setRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    setNumberOfTimelines: React.Dispatch<React.SetStateAction<number>>;
    pan: (deltaTop: number) => void;
    zoom: ({level, centerY}: {level: number, centerY?: number}) => void;
    zoomLevel: number;
    setWindow: (newRange: [number, number]) => void;
}

const VerticalScaleContext = createContext<VerticalScaleContext | undefined>(undefined);

export function VerticalScaleContextProvider({ children }: { children: React.ReactNode }) {
    const initialNumberOfTimelines = 10;
    const [numberOfTimelines, setNumberOfTimelines] = useState(initialNumberOfTimelines);
    const [domain, setDomain] = useState<[number, number]>(() => [0, initialNumberOfTimelines]);
    const [range, setRange] = useState<[number, number]>(() => [0, 600])
    const verticalScale = useMemo(() => d3.scaleLinear().domain(domain).range(range), [domain, range])
    const zoomLevel = useMemo(() => getZoomLevel({domain, numberOfTimelines}), [domain, numberOfTimelines]);

    // Pan to a certain number of pixels from the first timeline (top, index 0)
    const pan = useCallback((deltaTop: number) => {
        setDomain((prevDomain) => {
            // The range won't change (pixel positions stay the same)
            // But the domain will change. It will be shifted by deltaTop
            // The number of pixels of the delta will tell use which timeline to show at the top
            const newDomainStart = verticalScale.invert(range[0] + deltaTop);
            const newDomainEnd =   verticalScale.invert(range[1] + deltaTop);
            return [newDomainStart, newDomainEnd];
        })
    }, [numberOfTimelines, range]);


    // Zoom function
    // 100% zoom means the domain corresponds to the first and last timelines
    // 200% zoom means the domain is half the size of the first and last timelines
    const zoom = useCallback(({ level, centerY }: { level: number; centerY?: number }) => {
        const newNumberOfTimelines = Math.round(numberOfTimelines * 100 / level);
        setNumberOfTimelines(newNumberOfTimelines);
    }, [numberOfTimelines]);

    /** Change the range without stretching the domain */
    const setWindow = useCallback((newRange: [number, number]) => {
        setRange((prevRange) => {
            setDomain((prevDomain) => {
                // The domain will grow or shrink, but the pixel positions will stay the same
                const newTimeLineStart = verticalScale.invert(newRange[0]);
                const newTimeLineEnd = verticalScale.invert(newRange[1]);
                return [newTimeLineStart, newTimeLineEnd];
            })
            return newRange;
        })
    }, []);


    return (
        <VerticalScaleContext.Provider value={{verticalScale, domain, range, numberOfTimelines, setDomain, setRange, setNumberOfTimelines, pan, zoom, zoomLevel, setWindow}}>
            {children}
        </VerticalScaleContext.Provider>
    )

}


export function useVerticalScale() {
    const context = useContext(VerticalScaleContext);
    if (!context) {
        throw new Error("useVerticalScale must be used within a VerticalScaleContextProvider");
    }
    return context;
}



function getZoomLevel({domain, numberOfTimelines}: {domain: [number, number], numberOfTimelines: number}): number {
    return 100 * (domain[1] - domain[0]) / numberOfTimelines;
}