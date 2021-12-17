import { useRef, useEffect } from 'react';

export function useIsMountedRef() {
    const isMounted = useRef(true);

    useEffect(() => () => {
        isMounted.current = false;
    }, []);

    return isMounted;
}

export function bytesToSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

function two_digits(value) {
  if (value<10) {
    value = '0' + value;
  }
  return value;
};

function three_digits(value) {
  if (value<100) {
    value = '0' + value;
  }
  return two_digits(value);
}

export function convertIsoDate(isoDate) {
    const date = new Date(isoDate);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ' ' + two_digits(date.getUTCHours()) + ':' + two_digits(date.getUTCMinutes()) + ':' + two_digits(date.getUTCSeconds());
}

export function convertIsoDateWithMilliseconds(isoDate) {
    const date = new Date(isoDate);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ' ' + two_digits(date.getUTCHours()) + ':' + two_digits(date.getUTCMinutes()) + ':' + two_digits(date.getUTCSeconds()) + '.' + three_digits(date.getMilliseconds());
}

export function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}
