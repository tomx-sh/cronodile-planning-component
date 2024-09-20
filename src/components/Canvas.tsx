'use client'
import { useRef, createContext, useContext } from "react";
import useResponsive from "../hooks/useResponsive";
//import ScrollingWindow from "./ScrollingWindow";


export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactElement<SVGElement> | React.ReactElement<SVGElement>[]
}

interface CanvasContext {
    width: number
    height: number
}

const CanvasContext = createContext<CanvasContext | null>(null)


export default function Canvas({children, ...props}: CanvasProps) {
    const ref = useRef<HTMLDivElement>(null)
    const {width, height} = useResponsive({ref})

    return (
        <div {...props} ref={ref}>
            <CanvasContext.Provider value={{width, height}}>
                <svg width={width} height={height}>
                    {children}
                </svg>
            </CanvasContext.Provider>
            {/*<ScrollingWindow virtualWidth={1000} virtualHeight={1000} style={{ height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' }} />*/}
        </div>
    )
}


export const useCanvas = () => {
    const context = useContext(CanvasContext)
    if (!context) throw new Error('useCanvas must be used within a Canvas')
    return context
}