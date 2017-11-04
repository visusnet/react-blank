import './setup';
import jsdom from 'jsdom';

export default function () {
    global.document = jsdom.jsdom('<!doctype html><html><body><div id="root"/></body></html>',
        {url: 'http://localhost'});
    global.window = document.defaultView;
    global.navigator = window.navigator;
    return global.document.getElementById('root');
}
