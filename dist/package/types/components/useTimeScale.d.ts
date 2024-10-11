import React from "react";
import * as d3 from "d3";
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
    zoom: ({ level, centerX, centerDate }: {
        level: number;
        centerX?: number;
        centerDate?: Date;
    }) => void;
    zoomLevel: number;
    setWindow: (newRange: [number, number]) => void;
}
declare const TimeScaleContext: React.Context<TimeScaleContext | undefined>;
export declare function TimeScaleContextProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTimeScale(): TimeScaleContext;
export {};
