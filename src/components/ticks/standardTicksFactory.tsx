import * as d3 from 'd3';
import RegularTicks from './RegularTicks';
import { TimeScale } from '../useTimeScale';

type StandardTicksType = 'years' | 'months' | 'weeks' | 'days';


function getDaysTicksX(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const daysDates = d3.timeDay.range(startDate, endDate, 1)
    const daysTicksX = daysDates.map(d => timeScale(d))
    return daysTicksX
}

function getDaysTicksText(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const daysDates = d3.timeDay.range(startDate, endDate, 1)
    const daysTicksText = daysDates.map(d => d.getDate().toString())
    return daysTicksText
}

function getWeeksTicksX(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const weeksDates = d3.timeWeek.range(startDate, endDate, 1)
    const weeksTicksX = weeksDates.map(d => timeScale(d))
    return weeksTicksX
}

function getWeeksTicksText(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const weeksDates = d3.timeWeek.range(startDate, endDate, 1)
    const weeksTicksNumber = weeksDates.map(d => d3.timeFormat("%U")(d));
    const weekTicksText = weeksTicksNumber.map((d) => { return "S" + (parseInt(d) + 1).toString() })
    return weekTicksText
}

function getMonthsTicksX(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const monthsDates = d3.timeMonth.range(startDate, endDate, 1)
    const monthsTicksX = monthsDates.map(d => timeScale(d))
    return monthsTicksX
}

function getMonthsTicksText(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const monthsDates = d3.timeMonth.range(startDate, endDate, 1)
    const monthsTicksText = monthsDates.map(d => d.toLocaleString('fr-FR', { month: 'long' }))
    return monthsTicksText
}

function getYearsTicksX(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const yearsDates = d3.timeYear.range(startDate, endDate, 1)
    const yearsTicksX = yearsDates.map(d => timeScale(d))
    return yearsTicksX
}

function getYearsTicksText(timeScale: TimeScale) {
    const startDate = timeScale.domain()[0]
    const endDate = timeScale.domain()[1]
    const yearsDates = d3.timeYear.range(startDate, endDate, 1)
    const yearsTicksText = yearsDates.map(d => d.getFullYear().toString())
    return yearsTicksText
}


interface ToolboxReturnType {
    getX: (timeScale: TimeScale) => number[];
    getText: (timeScale: TimeScale) => string[];
}

/**
 * Gather the usefull functions for factory's ease of use
 */
const factoryToolbox: Record<StandardTicksType, ToolboxReturnType> = {
    'days'  : { getX: getDaysTicksX,   getText: getDaysTicksText },
    'weeks' : { getX: getWeeksTicksX,  getText: getWeeksTicksText },
    'months': { getX: getMonthsTicksX, getText: getMonthsTicksText },
    'years' : { getX: getYearsTicksX,  getText: getYearsTicksText }
}



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

export default function makeStandardTicks({ type, timeScale }: MakeStandardTicksArgs): StandardTicksComponent {
    const { getX, getText } = factoryToolbox[type];

    const ticksX = getX(timeScale);
    const ticksText = getText(timeScale);

    const StandardTicks: StandardTicksComponent = (props: StandardTicksProps) => {
        return <RegularTicks ticksX={ticksX} ticksText={ticksText} {...props} />
    }

    return StandardTicks;
}




function tooClose({ deltaX, largestTextWidth, margin }: { deltaX: number, largestTextWidth: number, margin: number }) {
    return deltaX <= largestTextWidth + 2*margin;
}


interface OverlapsArgs {
    type: StandardTicksType;
    timeScale: TimeScale;
    margin: number;
    fontSize: number;
    fontFamily: string;
}

export function overlaps({ type, timeScale, margin, fontSize, fontFamily }: OverlapsArgs) {
    const { getX, getText } = factoryToolbox[type];

    const ticksX = getX(timeScale);
    if (ticksX.length < 2) { return false;}
    const ticksText = getText(timeScale);

    const longestString = ticksText.reduce((a, b) => (a.length > b.length ? a : b), '');

    const largestTextWidth = measureTextWidth(longestString, fontSize, fontFamily);

    const deltaX = ticksX[1] - ticksX[0]; // Assume all the deltas are the same
    return tooClose({ deltaX, largestTextWidth, margin });
}


function measureTextWidth(text: string, fontSize: number, fontFamily: string): number {
    // Create an offscreen SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position: absolute; left: -9999px; top: -9999px;');

    const textElement = document.createElementNS(svg.namespaceURI, 'text') as SVGTextElement;
    textElement.setAttribute('style', `font-size: ${fontSize}px; font-family: ${fontFamily};`);
    textElement.textContent = text;

    svg.appendChild(textElement);
    document.body.appendChild(svg);

    // Ensure the font is loaded before measuring
    const width = textElement.getBBox().width;

    // Clean up
    document.body.removeChild(svg);
    return width;
}