import { CanvasProps } from "./Canvas";
interface ScrollableCanvasProps extends CanvasProps {
}
export default function ScrollableCanvas({ children, ...props }: ScrollableCanvasProps): import("react/jsx-runtime").JSX.Element;
interface ScrollableCanvasContext {
    scrollLeft: number;
    scrollTop: number;
    setVirtualHeight: (height: number) => void;
    setVirtualWidth: (width: number) => void;
}
declare const ScrollableCanvasContext: import("react").Context<ScrollableCanvasContext>;
export declare const useScrollableCanvas: () => ScrollableCanvasContext;
export {};
