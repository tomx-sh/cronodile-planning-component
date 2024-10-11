interface ScrollingWindowProps extends React.HTMLAttributes<HTMLDivElement> {
    virtualWidth: number;
    virtualHeight: number;
}

export default function ScrollingWindow({virtualWidth, virtualHeight, ...divProps}: ScrollingWindowProps) {

    const styles: React.CSSProperties = {
        overflow: 'scroll',
        //border: '2px solid blue',
        ...divProps.style
    }

    return (
        <div {...divProps} style={styles}>
            <div style={{ width: virtualWidth, height: virtualHeight}}>
            </div>
        </div>
    )
}