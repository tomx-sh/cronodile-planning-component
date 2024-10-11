import React from "react";
import { createContext } from "react";
import { useCanvas } from "./Canvas";
import { useTimeScale } from "../hooks/useTimeScale";
import { useEffect, useMemo } from "react";
import { useScrollableCanvas } from "./ScrollableCanvas";


interface LayoutContext {
    /** The y position of the horizontal split between the top bar and the content */
    horizontalY: number;

    /** The x position of the vertical split between the side bar and the content */
    verticalX: number;
}




const LayoutContext = createContext<LayoutContext | null>(null)


export default function CronoLayout({ children }: { children: React.ReactNode }) {
    const { width, height} = useCanvas()
    const { pan, setWindow } = useTimeScale()
    const { scrollLeft } = useScrollableCanvas()
    const horizontalY = useMemo(() => 80, [])
    const verticalX = useMemo(() => 50, [])
    const rightMargin = useMemo(() => 20, [])

    const context: LayoutContext = {horizontalY, verticalX}

    // When the view width changes, update the range (pixels)
    useEffect(() => {
        requestAnimationFrame(() =>
            setWindow([0, width - verticalX - rightMargin])
        )
    }, [width, verticalX, setWindow, rightMargin])


    // When ScrollLeft changes, update the domain (dates)
    useEffect(() => {
        requestAnimationFrame(() =>
            pan(scrollLeft)
        )
    }, [scrollLeft, pan])



    return (
        <g width={width} height={height}>
            <LayoutContext.Provider value={context}>
                    {children}
            </LayoutContext.Provider>
        </g>
    )
}


export function useCronoLayout() {
    const context = React.useContext(LayoutContext)
    if (!context) throw new Error('useLayout must be used within a Layout')
    return context
}