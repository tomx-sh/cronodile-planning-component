import "./globals.css";
import { TimeTicksContextProvider } from "../components/ticks/useTimeTicksState";
import { TimeScaleContextProvider } from "../hooks/useTimeScale";
import { VerticalScaleContextProvider } from "../hooks/useVerticalScale";


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <TimeScaleContextProvider>
            <VerticalScaleContextProvider>
                <TimeTicksContextProvider>
                    {children}
                </TimeTicksContextProvider>
            </VerticalScaleContextProvider>
        </TimeScaleContextProvider>
    );
}
