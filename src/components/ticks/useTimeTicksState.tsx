import { createContext, useContext, useState } from "react";


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

const TimeTicksContext = createContext<TimeTicksContext | null>(null);


export function TimeTicksContextProvider({ children }: { children: React.ReactNode }) {
    const [showDays, setShowDays] = useState(true);
    const [showWeeks, setShowWeeks] = useState(true);
    const [showMonths, setShowMonths] = useState(true);
    const [showYears, setShowYears] = useState(true);

    const value = {
        showDays,
        showWeeks,
        showMonths,
        showYears,
        setShowDays,
        setShowWeeks,
        setShowMonths,
        setShowYears,
    }

    return (
        <TimeTicksContext.Provider value={value}>
            {children}
        </TimeTicksContext.Provider>
    )
}

export function useTimeTicksState() {
    const context = useContext(TimeTicksContext)
    if (!context) throw new Error('useTimeTicksState must be used within a TimeTicks')
    return context
}