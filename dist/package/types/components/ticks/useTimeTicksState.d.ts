interface TimeTicksState {
    showDays: boolean;
    showWeeks: boolean;
    showMonths: boolean;
    showYears: boolean;
}
interface TimeTicksContext extends TimeTicksState {
    setShowDays: React.Dispatch<React.SetStateAction<boolean>>;
    setShowWeeks: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMonths: React.Dispatch<React.SetStateAction<boolean>>;
    setShowYears: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const TimeTicksContext: import("react").Context<TimeTicksContext | null>;
export declare function TimeTicksContextProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTimeTicksState(): TimeTicksContext;
export {};
