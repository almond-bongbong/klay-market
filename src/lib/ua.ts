import uaParser from 'ua-parser-js';

export const ua = () => uaParser(window.navigator.userAgent);
