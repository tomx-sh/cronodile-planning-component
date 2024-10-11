import React from "react";
interface LayoutContext {
    /** The y position of the horizontal split between the top bar and the content */
    horizontalY: number;
    /** The x position of the vertical split between the side bar and the content */
    verticalX: number;
}
declare const LayoutContext: React.Context<LayoutContext | null>;
export default function CronoLayout({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useCronoLayout(): LayoutContext;
export {};
