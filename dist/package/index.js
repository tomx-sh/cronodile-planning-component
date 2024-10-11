'use strict';

var jsxRuntime = require('react/jsx-runtime');
var tslib = require('tslib');
var React = require('react');

/**
 * Tracks the size of an element and updates when it changes
 * Needed by the Canvas component only
 */
function useResponsive({ ref }) {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();
    const handleResize = React.useCallback(() => {
        requestAnimationFrame(() => {
            startTransition(() => {
                if (ref.current) {
                    setWidth(ref.current.clientWidth);
                    setHeight(ref.current.clientHeight);
                }
            });
        });
    }, [ref, setWidth, setHeight]);
    React.useEffect(() => {
        const resizeObserver = new ResizeObserver(() => handleResize());
        if (ref.current) {
            resizeObserver.observe(ref.current);
            handleResize();
        }
        return () => { resizeObserver.disconnect(); };
    }, [ref, handleResize]);
    return { width, height };
}

const CanvasContext = React.createContext(null);
function Canvas(_a) {
    var { children } = _a, props = tslib.__rest(_a, ["children"]);
    const ref = React.useRef(null);
    const { width, height } = useResponsive({ ref });
    return (jsxRuntime.jsx("div", Object.assign({}, props, { ref: ref, children: jsxRuntime.jsx(CanvasContext.Provider, { value: { width, height }, children: jsxRuntime.jsx("svg", { width: width, height: height, children: children }) }) })));
}
const useCanvas = () => {
    const context = React.useContext(CanvasContext);
    if (!context)
        throw new Error('useCanvas must be used within a Canvas');
    return context;
};

function ScrollingWindow(_a) {
    var { virtualWidth, virtualHeight } = _a, divProps = tslib.__rest(_a, ["virtualWidth", "virtualHeight"]);
    const styles = Object.assign({ overflow: 'scroll' }, divProps.style);
    return (jsxRuntime.jsx("div", Object.assign({}, divProps, { style: styles, children: jsxRuntime.jsx("div", { style: { width: virtualWidth, height: virtualHeight } }) })));
}

function ScrollableCanvas(_a) {
    var { children } = _a, props = tslib.__rest(_a, ["children"]);
    const [virtualHeight, setVirtualHeight] = React.useState(0);
    const [virtualWidth, setVirtualWidth] = React.useState(1000);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [scrollTop, setScrollTop] = React.useState(0);
    function onScroll(e) {
        const target = e.target;
        setScrollLeft(target.scrollLeft);
        setScrollTop(target.scrollTop);
    }
    return (jsxRuntime.jsxs("div", Object.assign({}, props, { children: [jsxRuntime.jsx(ScrollableCanvasContext.Provider, { value: { scrollLeft, scrollTop, setVirtualHeight, setVirtualWidth }, children: jsxRuntime.jsx(Canvas, { style: { height: '100%', width: '100%' }, children: children }) }), jsxRuntime.jsx(ScrollingWindow, { virtualWidth: virtualWidth, virtualHeight: virtualHeight, onScroll: onScroll, style: { height: '100%', width: '100%', position: 'absolute', top: '0', left: '0' } })] })));
}
const emptyScrollableCanvasContext = {
    scrollLeft: 0,
    scrollTop: 0,
    setVirtualHeight: () => { },
    setVirtualWidth: () => { }
};
const ScrollableCanvasContext = React.createContext(emptyScrollableCanvasContext);
const useScrollableCanvas = () => {
    const context = React.useContext(ScrollableCanvasContext);
    if (!context)
        throw new Error('useScrollableCanvas must be used within a ScrollableCanvas');
    return context;
};

const t0 = new Date, t1 = new Date;

function timeInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
  }

  interval.floor = (date) => {
    return floori(date = new Date(+date)), date;
  };

  interval.ceil = (date) => {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = (date) => {
    const d0 = interval(date), d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = (date, step) => {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = (start, stop, step) => {
    const range = [];
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    let previous;
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = (test) => {
    return timeInterval((date) => {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, (date, step) => {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = (start, end) => {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = (step) => {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? (d) => field(d) % step === 0
              : (d) => interval.count(0, d) % step === 0);
    };
  }

  return interval;
}

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;

const timeDay = timeInterval(
  date => date.setHours(0, 0, 0, 0),
  (date, step) => date.setDate(date.getDate() + step),
  (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
  date => date.getDate() - 1
);

timeDay.range;

const utcDay = timeInterval((date) => {
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCDate(date.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / durationDay;
}, (date) => {
  return date.getUTCDate() - 1;
});

utcDay.range;

const unixDay = timeInterval((date) => {
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCDate(date.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / durationDay;
}, (date) => {
  return Math.floor(date / durationDay);
});

unixDay.range;

function timeWeekday(i) {
  return timeInterval((date) => {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setDate(date.getDate() + step * 7);
  }, (start, end) => {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}

const timeSunday = timeWeekday(0);
const timeMonday = timeWeekday(1);
const timeTuesday = timeWeekday(2);
const timeWednesday = timeWeekday(3);
const timeThursday = timeWeekday(4);
const timeFriday = timeWeekday(5);
const timeSaturday = timeWeekday(6);

timeSunday.range;
timeMonday.range;
timeTuesday.range;
timeWednesday.range;
timeThursday.range;
timeFriday.range;
timeSaturday.range;

function utcWeekday(i) {
  return timeInterval((date) => {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, (start, end) => {
    return (end - start) / durationWeek;
  });
}

const utcSunday = utcWeekday(0);
const utcMonday = utcWeekday(1);
const utcTuesday = utcWeekday(2);
const utcWednesday = utcWeekday(3);
const utcThursday = utcWeekday(4);
const utcFriday = utcWeekday(5);
const utcSaturday = utcWeekday(6);

utcSunday.range;
utcMonday.range;
utcTuesday.range;
utcWednesday.range;
utcThursday.range;
utcFriday.range;
utcSaturday.range;

const timeMonth = timeInterval((date) => {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, (date, step) => {
  date.setMonth(date.getMonth() + step);
}, (start, end) => {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, (date) => {
  return date.getMonth();
});

timeMonth.range;

const utcMonth = timeInterval((date) => {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCMonth(date.getUTCMonth() + step);
}, (start, end) => {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, (date) => {
  return date.getUTCMonth();
});

utcMonth.range;

const timeYear = timeInterval((date) => {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, (date, step) => {
  date.setFullYear(date.getFullYear() + step);
}, (start, end) => {
  return end.getFullYear() - start.getFullYear();
}, (date) => {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
timeYear.every = (k) => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

timeYear.range;

const utcYear = timeInterval((date) => {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, (start, end) => {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, (date) => {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = (k) => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

utcYear.range;

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newDate(y, m, d) {
  return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "g": formatYearISO,
    "G": formatFullYearISO,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "g": formatUTCYearISO,
    "G": formatUTCFullYearISO,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "g": parseYear,
    "G": parseFullYear,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, Z) {
    return function(string) {
      var d = newDate(1900, undefined, 1),
          i = parseSpecifier(d, specifier, string += "", 0),
          week, day;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

      // If this is utcParse, never use the local timezone.
      if (Z && !("Z" in d)) d.Z = 0;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // If the month was not specified, inherit from the quarter.
      if (d.m === undefined) d.m = "q" in d ? d.q : 0;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
          week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
          week = day > 4 || day === 0 ? timeMonday.ceil(week) : timeMonday(week);
          week = timeDay.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return localDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", false);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier += "", true);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"},
    numberRe = /^\s*\d+/, // note: ignores next directive
    percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  return new Map(names.map((name, i) => [name.toLowerCase(), i]));
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseQuarter(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.s = +n[0], i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + timeDay.count(timeYear(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(timeSunday.count(timeYear(d) - 1, d), p, 2);
}

function dISO(d) {
  var day = d.getDay();
  return (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
}

function formatWeekNumberISO(d, p) {
  d = dISO(d);
  return pad(timeThursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(timeMonday.count(timeYear(d) - 1, d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatYearISO(d, p) {
  d = dISO(d);
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatFullYearISO(d, p) {
  var day = d.getDay();
  d = (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
}

function UTCdISO(d) {
  var day = d.getUTCDay();
  return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
}

function formatUTCWeekNumberISO(d, p) {
  d = UTCdISO(d);
  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCYearISO(d, p) {
  d = UTCdISO(d);
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCFullYearISO(d, p) {
  var day = d.getUTCDay();
  d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

var locale;
var timeFormat;

defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  timeFormat = locale.format;
  locale.parse;
  locale.utcFormat;
  locale.utcParse;
  return locale;
}

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

Transform.prototype;

const TimeScaleContext = React.createContext(undefined);
function useTimeScale() {
    const context = React.useContext(TimeScaleContext);
    if (!context) {
        throw new Error("useScale must be used within a TimeScaleContextProvider");
    }
    return context;
}

const LayoutContext = React.createContext(null);
function CronoLayout({ children }) {
    const { width, height } = useCanvas();
    const { pan, setWindow } = useTimeScale();
    const { scrollLeft } = useScrollableCanvas();
    const horizontalY = React.useMemo(() => 80, []);
    const verticalX = React.useMemo(() => 50, []);
    const rightMargin = React.useMemo(() => 20, []);
    const context = { horizontalY, verticalX };
    // When the view width changes, update the range (pixels)
    React.useEffect(() => {
        requestAnimationFrame(() => setWindow([0, width - verticalX - rightMargin]));
    }, [width, verticalX, setWindow, rightMargin]);
    // When ScrollLeft changes, update the domain (dates)
    React.useEffect(() => {
        requestAnimationFrame(() => pan(scrollLeft));
    }, [scrollLeft, pan]);
    return (jsxRuntime.jsx("g", { width: width, height: height, children: jsxRuntime.jsx(LayoutContext.Provider, { value: context, children: children }) }));
}
function useCronoLayout() {
    const context = React.useContext(LayoutContext);
    if (!context)
        throw new Error('useLayout must be used within a Layout');
    return context;
}

const TimeTicksContext = React.createContext(null);
function useTimeTicksState() {
    const context = React.useContext(TimeTicksContext);
    if (!context)
        throw new Error('useTimeTicksState must be used within a TimeTicks');
    return context;
}

function Tick({ tickHeight, text, margin = 3, textSize = 10, strokeWidth = 1, strokeColor = 'black', textColor = 'black', font = 'Arial', }) {
    const { height } = useCanvas();
    const { horizontalY } = useCronoLayout();
    // TODO: position text from baseline and use font size for the tick height
    return (jsxRuntime.jsxs("g", { children: [jsxRuntime.jsx("line", { y1: -tickHeight, y2: height - horizontalY, stroke: strokeColor, strokeWidth: strokeWidth }), jsxRuntime.jsx("text", { x: margin, y: -tickHeight, textAnchor: "start", alignmentBaseline: "hanging", fill: textColor, fontSize: textSize, fontFamily: font, children: text })] }));
}

function RegularTicks({ ticksX, ticksText, textSize, height, margin, strokeWidth }) {
    return (jsxRuntime.jsx("g", { children: ticksX.map((x, i) => (jsxRuntime.jsx("g", { transform: `translate(${x}, 0)`, children: jsxRuntime.jsx(Tick, { text: ticksText[i], textSize: textSize, tickHeight: height, margin: margin, strokeWidth: strokeWidth }, i) }, i))) }));
}

function getDaysTicksX(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const daysDates = timeDay.range(startDate, endDate, 1);
    const daysTicksX = daysDates.map(d => timeScale(d));
    return daysTicksX;
}
function getDaysTicksText(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const daysDates = timeDay.range(startDate, endDate, 1);
    const daysTicksText = daysDates.map(d => d.getDate().toString());
    return daysTicksText;
}
function getWeeksTicksX(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const weeksDates = timeSunday.range(startDate, endDate, 1);
    const weeksTicksX = weeksDates.map(d => timeScale(d));
    return weeksTicksX;
}
function getWeeksTicksText(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const weeksDates = timeSunday.range(startDate, endDate, 1);
    const weeksTicksNumber = weeksDates.map(d => timeFormat("%U")(d));
    const weekTicksText = weeksTicksNumber.map((d) => { return "S" + (parseInt(d) + 1).toString(); });
    return weekTicksText;
}
function getMonthsTicksX(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const monthsDates = timeMonth.range(startDate, endDate, 1);
    const monthsTicksX = monthsDates.map(d => timeScale(d));
    return monthsTicksX;
}
function getMonthsTicksText(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const monthsDates = timeMonth.range(startDate, endDate, 1);
    const monthsTicksText = monthsDates.map(d => d.toLocaleString('fr-FR', { month: 'long' }));
    return monthsTicksText;
}
function getYearsTicksX(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const yearsDates = timeYear.range(startDate, endDate, 1);
    const yearsTicksX = yearsDates.map(d => timeScale(d));
    return yearsTicksX;
}
function getYearsTicksText(timeScale) {
    const startDate = timeScale.domain()[0];
    const endDate = timeScale.domain()[1];
    const yearsDates = timeYear.range(startDate, endDate, 1);
    const yearsTicksText = yearsDates.map(d => d.getFullYear().toString());
    return yearsTicksText;
}
/**
 * Gather the usefull functions for factory's ease of use
 */
const factoryToolbox = {
    'days': { getX: getDaysTicksX, getText: getDaysTicksText },
    'weeks': { getX: getWeeksTicksX, getText: getWeeksTicksText },
    'months': { getX: getMonthsTicksX, getText: getMonthsTicksText },
    'years': { getX: getYearsTicksX, getText: getYearsTicksText }
};
function makeStandardTicks({ type, timeScale }) {
    const { getX, getText } = factoryToolbox[type];
    const ticksX = getX(timeScale);
    const ticksText = getText(timeScale);
    const StandardTicks = (props) => {
        return jsxRuntime.jsx(RegularTicks, Object.assign({ ticksX: ticksX, ticksText: ticksText }, props));
    };
    return StandardTicks;
}
function tooClose({ deltaX, largestTextWidth, margin }) {
    return deltaX <= largestTextWidth + 2 * margin;
}
function overlaps({ type, timeScale, margin, fontSize, fontFamily }) {
    const { getX, getText } = factoryToolbox[type];
    const ticksX = getX(timeScale);
    if (ticksX.length < 2) {
        return false;
    }
    const ticksText = getText(timeScale);
    const longestString = ticksText.reduce((a, b) => (a.length > b.length ? a : b), '');
    const largestTextWidth = measureTextWidth(longestString, fontSize, fontFamily);
    const deltaX = ticksX[1] - ticksX[0]; // Assume all the deltas are the same
    return tooClose({ deltaX, largestTextWidth, margin });
}
function measureTextWidth(text, fontSize, fontFamily) {
    // Create an offscreen SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position: absolute; left: -9999px; top: -9999px;');
    const textElement = document.createElementNS(svg.namespaceURI, 'text');
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

function TimeTicks() {
    const { horizontalY, verticalX } = useCronoLayout();
    const { showDays, setShowDays, showWeeks, setShowWeeks, showMonths, setShowMonths, showYears, setShowYears } = useTimeTicksState();
    const { timeScale } = useTimeScale();
    // The ticks are stacked on top of each other, from bottom to top: days, weeks, months, years.
    // If any of those four is not displayed, the ticks are shifted down to fill the gap.
    // Constants
    const ticksTextMargin = 5; // Around the text
    const fontSizeDays = 8;
    const fontSizeWeeks = 10;
    const fontSizeMonths = 12;
    const fontSizeYears = 14;
    const fontFamily = 'Arial';
    const { daysPosition, weeksPosition, monthsPosition, yearsPosition } = React.useMemo(() => {
        // Initialize positions
        let currentPosition = 10;
        let daysPosition = 0;
        let weeksPosition = 0;
        let monthsPosition = 0;
        let yearsPosition = 0;
        if (showDays) {
            daysPosition = currentPosition;
            currentPosition += fontSizeDays + ticksTextMargin;
        }
        if (showWeeks) {
            weeksPosition = currentPosition;
            currentPosition += fontSizeWeeks + ticksTextMargin;
        }
        if (showMonths) {
            monthsPosition = currentPosition;
            currentPosition += fontSizeMonths + ticksTextMargin;
        }
        if (showYears) {
            yearsPosition = currentPosition;
            currentPosition += fontSizeYears + ticksTextMargin;
        }
        return { daysPosition, weeksPosition, monthsPosition, yearsPosition };
    }, [showDays, showWeeks, showMonths, showYears]);
    const { daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize } = React.useMemo(() => {
        const strokesIds = ['days', 'weeks', 'months', 'years'];
        const show = [showDays, showWeeks, showMonths, showYears];
        // Keep only the strokes that are displayed, thanks to the mask
        const displayedStrokes = strokesIds.filter((_, i) => show[i]); // Now they are ordered with a useful index
        const [daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize] = strokesIds.map((id, i) => {
            // If hidden, return 0
            if (!show[i])
                return 0;
            // If displayed, return the size
            const reducedIndex = displayedStrokes.indexOf(id);
            return reducedIndex + 1; // This is a simple linear scale
        });
        return { daysStrokeSize, weeksStrokeSize, monthsStrokeSize, yearsStrokeSize };
    }, [showDays, showWeeks, showMonths, showYears]);
    // Depending on the date range, the ticks can be too close to each other.
    // In this case, we should hide them.
    React.useEffect(() => {
        requestAnimationFrame(() => {
            const daysOverlap = overlaps({ type: 'days', timeScale, margin: ticksTextMargin, fontSize: fontSizeDays, fontFamily });
            setShowDays(!daysOverlap);
            const weelsOverlap = overlaps({ type: 'weeks', timeScale, margin: ticksTextMargin, fontSize: fontSizeWeeks, fontFamily });
            setShowWeeks(!weelsOverlap);
            const monthsOverlap = overlaps({ type: 'months', timeScale, margin: ticksTextMargin, fontSize: fontSizeMonths, fontFamily });
            setShowMonths(!monthsOverlap);
            const yearsOverlap = overlaps({ type: 'years', timeScale, margin: ticksTextMargin, fontSize: fontSizeYears, fontFamily });
            setShowYears(!yearsOverlap);
        });
    }, [timeScale, setShowDays, setShowWeeks, setShowMonths, setShowYears]);
    const DaysTicks = makeStandardTicks({ type: 'days', timeScale });
    const WeeksTicks = makeStandardTicks({ type: 'weeks', timeScale });
    const MonthsTicks = makeStandardTicks({ type: 'months', timeScale });
    const YearsTicks = makeStandardTicks({ type: 'years', timeScale });
    return (jsxRuntime.jsxs("g", { transform: `translate(${verticalX}, ${horizontalY})`, children: [showDays && jsxRuntime.jsx(DaysTicks, { textSize: fontSizeDays, height: daysPosition, margin: ticksTextMargin, strokeWidth: daysStrokeSize }), showWeeks && jsxRuntime.jsx(WeeksTicks, { textSize: fontSizeWeeks, height: weeksPosition, margin: ticksTextMargin, strokeWidth: weeksStrokeSize }), showMonths && jsxRuntime.jsx(MonthsTicks, { textSize: fontSizeMonths, height: monthsPosition, margin: ticksTextMargin, strokeWidth: monthsStrokeSize }), showYears && jsxRuntime.jsx(YearsTicks, { textSize: fontSizeYears, height: yearsPosition, margin: ticksTextMargin, strokeWidth: yearsStrokeSize })] }));
}

function CronodilePlanning() {
    return (jsxRuntime.jsx(ScrollableCanvas, { style: { height: '100%', width: '100%' }, children: jsxRuntime.jsx(CronoLayout, { children: jsxRuntime.jsx(TimeTicks, {}) }) }));
}

module.exports = CronodilePlanning;
//# sourceMappingURL=index.js.map
