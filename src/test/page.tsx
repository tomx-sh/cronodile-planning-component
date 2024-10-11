import Resizable from "../components/Resizable";
import CronoLayout from "../components/CronoLayout";
import TimeTicks from "../components/ticks/TimeTicks";
import { useTimeTicksState } from "../components/ticks/useTimeTicksState";
import { useTimeScale } from "../hooks/useTimeScale";
import ScrollableCanvas from "../components/ScrollableCanvas";
import { useState } from "react";
import Timelines from "../components/timelines/Timelines";


export default function Home() {
    const { showDays, setShowDays, showWeeks, setShowWeeks, showMonths, setShowMonths, showYears, setShowYears } = useTimeTicksState()
    const { zoom, zoomLevel } = useTimeScale()
    const [inputZoom, setInputZoom] = useState(() => zoomLevel);

    // Use the range input to zoom in and out
    const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const level = parseInt(e.target.value);
        zoom({level, centerX: 0});
        setInputZoom(level);
    }


    return (
        <main style={{height: '100vh', overflow:'hidden', backgroundColor:'black'}}>
            <div style={{height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', gap:'10px'}}>

                <Resizable>
                    <ScrollableCanvas style={{height: '100%', width: '100%'}}>
                        <CronoLayout>
                            <TimeTicks />
                            <Timelines />
                        </CronoLayout>
                    </ScrollableCanvas>
                </Resizable>

                <div style={{backgroundColor:'white', padding:'10px', borderRadius:'10px', display:'flex', flexDirection:'column'}}>
                    <label>
                        <input type="range" min="10" max="500" value={inputZoom} onChange={handleZoom} />
                        Input Zoom: {inputZoom.toFixed()}%
                    </label>

                    <label>
                        <input type="checkbox" checked={showDays} onChange={(e) => setShowDays(e.target.checked)} />
                        Show days
                    </label>

                    <label>
                        <input type="checkbox" checked={showWeeks} onChange={(e) => setShowWeeks(e.target.checked)} />
                        Show weeks
                    </label>

                    <label>
                        <input type="checkbox" checked={showMonths} onChange={(e) => setShowMonths(e.target.checked)} />
                        Show months
                    </label>

                    <label>
                        <input type="checkbox" checked={showYears} onChange={(e) => setShowYears(e.target.checked)} />
                        Show years
                    </label>

                </div>
            </div>
        </main>
    );
}
