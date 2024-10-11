interface UseResponsiveHook {
    width: number;
    height: number;
}
interface UseResponsiveProps {
    /**
     * The ref of the element to observe for size changes
     */
    ref: React.RefObject<HTMLDivElement>;
}
/**
 * Tracks the size of an element and updates when it changes
 * Needed by the Canvas component only
 */
export default function useResponsive({ ref }: UseResponsiveProps): UseResponsiveHook;
export {};
