import { useState, useEffect, useCallback, useTransition } from "react";


interface UseResponsiveHook {
    width: number
    height: number
}

interface UseResponsiveProps {
    /**
     * The ref of the element to observe for size changes
     */
    ref: React.RefObject<HTMLDivElement>
}

/**
 * Tracks the size of an element and updates when it changes
 * Needed by the Canvas component only
 */
export default function useResponsive({ref}: UseResponsiveProps): UseResponsiveHook {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [isPending, startTransition] = useTransition()

    const handleResize = useCallback(() => {
        requestAnimationFrame(() => {
            startTransition(() => {  
                if (ref.current) {
                    setWidth(ref.current.clientWidth)
                    setHeight(ref.current.clientHeight)
                }
            })
        })
    }, [ref, setWidth, setHeight])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => handleResize())
        if (ref.current) {
            resizeObserver.observe(ref.current)
            handleResize()
        }
        return () => { resizeObserver.disconnect()}
    }, [ref, handleResize])

    return {width, height}
}