import { TimeScale } from '../useTimeScale';
type StandardTicksType = 'years' | 'months' | 'weeks' | 'days';
interface MakeStandardTicksArgs {
    type: StandardTicksType;
    timeScale: TimeScale;
}
interface StandardTicksProps {
    textSize: number;
    height: number;
    margin: number;
    strokeWidth: number;
}
type StandardTicksComponent = React.FC<StandardTicksProps>;
export default function makeStandardTicks({ type, timeScale }: MakeStandardTicksArgs): StandardTicksComponent;
interface OverlapsArgs {
    type: StandardTicksType;
    timeScale: TimeScale;
    margin: number;
    fontSize: number;
    fontFamily: string;
}
export declare function overlaps({ type, timeScale, margin, fontSize, fontFamily }: OverlapsArgs): boolean;
export {};
