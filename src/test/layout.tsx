import "./globals.css";
import { TimeTicksContextProvider } from "../components/ticks/useTimeTicksState";
import { TimeScaleContextProvider } from "../components/useTimeScale";


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body>
                <TimeScaleContextProvider>
                    <TimeTicksContextProvider>
                        {children}
                    </TimeTicksContextProvider>
                </TimeScaleContextProvider>
            </body>
        </html>
    );
}
