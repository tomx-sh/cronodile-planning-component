import { ResizableBox } from 'react-resizable';
import './resizable.css';

export default function Resizable({ children }: { children?: React.ReactNode }) {
    return (
        <ResizableBox
            width={600}
            height={300}
            minConstraints={[100, 100]}
            style={{backgroundColor: 'white'}}
        >
            {children}
        </ResizableBox>
    )
}