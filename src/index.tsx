import React from 'react';
import ScrollableCanvas from './components/ScrollableCanvas';
import CronoLayout from './components/CronoLayout';
import TimeTicks from './components/ticks/TimeTicks';

export default function CronodilePlanning() {
    return (
        <ScrollableCanvas style={{ height: '100%', width: '100%' }}>
            <CronoLayout>
                <TimeTicks />
            </CronoLayout>
        </ScrollableCanvas>
    )
}