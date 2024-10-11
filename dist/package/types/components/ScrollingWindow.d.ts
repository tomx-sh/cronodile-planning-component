interface ScrollingWindowProps extends React.HTMLAttributes<HTMLDivElement> {
    virtualWidth: number;
    virtualHeight: number;
}
export default function ScrollingWindow({ virtualWidth, virtualHeight, ...divProps }: ScrollingWindowProps): import("react/jsx-runtime").JSX.Element;
export {};
