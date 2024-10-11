import Canvas from "./Canvas"
import { CanvasProps } from "./Canvas"
import ScrollingWindow from "./ScrollingWindow"
import { useState, createContext, useContext } from "react"


interface ScrollableCanvasProps extends CanvasProps {}

export default function ScrollableCanvas({children, ...props}: ScrollableCanvasProps) {
    const [virtualHeight, setVirtualHeight] = useState(0)
    const [virtualWidth, setVirtualWidth] = useState(1000)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [scrollTop, setScrollTop] = useState(0)

    function onScroll(e: React.UIEvent<HTMLDivElement>) {
        const target = e.target as HTMLDivElement
        setScrollLeft(target.scrollLeft)
        setScrollTop(target.scrollTop)
    }

    return (
        <div {...props}>
            <ScrollableCanvasContext.Provider value={{scrollLeft, scrollTop, setVirtualHeight, setVirtualWidth}}>
                <Canvas style={{height: '100%', width: '100%'}}>
                    {children}
                </Canvas>
            </ScrollableCanvasContext.Provider>
            <ScrollingWindow
                virtualWidth={virtualWidth}
                virtualHeight={virtualHeight}
                onScroll={onScroll}
                style={{ height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' }}
            />
        </div>
    )
}


interface ScrollableCanvasContext {
    scrollLeft: number
    scrollTop: number
    setVirtualHeight: (height: number) => void
    setVirtualWidth: (width: number) => void
}

const emptyScrollableCanvasContext: ScrollableCanvasContext = {
    scrollLeft: 0,
    scrollTop: 0,
    setVirtualHeight: () => {},
    setVirtualWidth: () => {}
}

const ScrollableCanvasContext = createContext<ScrollableCanvasContext>(emptyScrollableCanvasContext)

export const useScrollableCanvas = () => {
    const context = useContext(ScrollableCanvasContext)
    if (!context) throw new Error('useScrollableCanvas must be used within a ScrollableCanvas')
    return context
}