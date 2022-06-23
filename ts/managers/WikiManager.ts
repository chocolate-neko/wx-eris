import * as htmlparser2 from 'htmlparser2';
import { DomUtils } from 'htmlparser2';
import DomHandler, { Element } from 'domhandler';
import render from 'dom-serializer';
import { Tabletojson } from 'tabletojson';

const XMLHttpRequest = require('xhr2');

export default class WikiManager {
    private static async getData(url: string): Promise<string> {
        const xmlHttpReq: XMLHttpRequest = new XMLHttpRequest();
        const promise = new Promise<string>((resolve, reject) => {
            xmlHttpReq.onreadystatechange = () => {
                if (xmlHttpReq.readyState === 4) {
                    if (xmlHttpReq.status === 200) {
                        resolve(xmlHttpReq.responseText);
                    } else {
                        reject(xmlHttpReq.statusText);
                    }
                }
            };
        });
        xmlHttpReq.open('GET', url, true);
        xmlHttpReq.send(null);
        return promise;
    }

    // TODO fix empty Element return, cause is unknown
    public static async getWikiData(url: string) {
        let dataArray: any[] = [];
        let elements: Element[] = [];
        const data = await this.getData(url);

        const handler = new DomHandler((err, dom) => {
            if (err) {
                console.error(err);
            }
            elements = DomUtils.getElementsByTagName(
                'table',
                DomUtils.findAll(
                    (elem) =>
                        ((elem.attribs.class ?? '').includes('info-main') ||
                            (elem.attribs.class ?? '').includes('info-extra') ||
                            (elem.attribs.class ?? '').includes(
                                'wds-tab__content',
                            ) ||
                            (elem.attribs.class ?? '').includes(
                                'mw-parser-output',
                            )) &&
                        elem.name === 'div',
                    dom,
                ),
            );
        });

        const parser = new htmlparser2.Parser(handler);
        // console.log(JSON.parse(data).parse.text['*']);
        parser.write(JSON.parse(data).parse.text['*']);
        parser.end();

        elements.forEach((elem) => {
            let r = render(elem).replace(
                /<img.*?alt="(.*?)"[^\>]+>|<(?:a\b[^>]*>|\/a>)/g,
                '$1',
            );
            r = r.replace(/\.png/g, '');
            dataArray.push(
                Tabletojson.convert(r, {
                    stripHtml: true,
                }),
            );
        });
        return dataArray.flat(10).slice(7);
        // return elements;
    }
}
