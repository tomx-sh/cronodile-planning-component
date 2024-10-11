export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactElement<SVGElement> | React.ReactElement<SVGElement>[];
}
interface CanvasContext {
    width: number;
    height: number;
}
declare const CanvasContext: import("react").Context<CanvasContext | null>;
export default function Canvas({ children, ...props }: CanvasProps): import("react/jsx-runtime").JSX.Element;
export declare const useCanvas: () => CanvasContext;
export {};
