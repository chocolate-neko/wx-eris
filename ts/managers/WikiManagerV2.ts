import DomHandler, { Element } from 'domhandler';
import { DomUtils, Parser } from 'htmlparser2';
import render from 'dom-serializer';
const WIKI_URL: string = 'https://wixoss.fandom.com/api.php?';
const IMAGETEXT_FORMAT_STRING: string = '||$1||';

const HTML_ENTITIES = [
    {
        name: '&nbsp;',
        value: '&#160;',
    },
    {
        name: '&lt;',
        value: '&#60;',
    },
    {
        name: '&gt;',
        value: '&#62;',
    },
    {
        name: '&amp;',
        value: '&#38;',
    },
    {
        name: '&quot;',
        value: '&#34;',
    },
    {
        name: '&apos;',
        value: '&#39;',
    },
    {
        name: '&cent;',
        value: '&#162;',
    },
    {
        name: '&pound;',
        value: '&#163;',
    },
    {
        name: '&yen;',
        value: '&#165;',
    },
    {
        name: '&euro;',
        value: '&#8364;',
    },
    {
        name: '&copy;',
        value: '&#169;',
    },
    {
        name: '&reg;',
        value: '&#174;',
    },
];
export default class WikiManager {
    public static async fetchData(searchTerm: string): Promise<string> {
        const url =
            WIKI_URL +
            new URLSearchParams({
                origin: '*',
                action: 'parse',
                prop: 'text',
                page: searchTerm,
                format: 'json',
            });

        try {
            const req = await fetch(url);
            const json = await req.json();
            return json.parse.text['*'];
        } catch (e) {
            return <string>e;
        }
    }

    public static async parseWikiHTML(search: string): Promise<string[][]> {
        const wikiHTML = await this.fetchData(search);
        let returnArray: string[][] = [];
        let elements: Element[] = [];
        let cardImg: string[] = [];

        const handler = new DomHandler((err, dom) => {
            if (err) {
                console.error(err);
            }

            cardImg.push(
                DomUtils.getElementsByTagName(
                    'img',
                    DomUtils.findAll(
                        (elem) =>
                            (elem.attribs.class ?? '').includes('image') &&
                            elem.name === 'a',
                        dom,
                    ),
                )[0].attribs.src,
            );

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

        const parser = new Parser(handler);
        parser.write(wikiHTML);
        parser.end();

        // console.log(render(elements));
        // returnArray.push(cardImg);
        // returnArray.push(this.parseTableToArray(elements));
        // return returnArray;
        returnArray = this.parseTableToArray(elements);
        returnArray.unshift(cardImg);
        return returnArray;

        // return wikiHTML;
    }

    private static parseTableToArray(elementsArr: Element[]) {
        let elements: Array<Element[]> = [];
        elementsArr.forEach((elem) => {
            // console.log(
            //     render(elem) +
            //         '\n ################# NEW LINE #################',
            // );
            // elem.childNodes.forEach((child) => {
            //     console.log(render(child) + '\n####### NEW LINE #######');
            // });
            elements.push(DomUtils.getElementsByTagName('tr', elem));
            // console.log(render(DomUtils.getElementsByTagName('tr', elem)));
        });
        // console.log(elements.length);

        let tableArray: Array<string[]> = [];
        elements.forEach((element) => {
            let rowArray: string[] = [];
            const tableData = DomUtils.findAll(
                (e) => e.name === 'td' || e.name === 'th',
                element,
            );
            if (tableData.length > 0) {
                tableData.forEach((data) => {
                    const text = render(data)
                        .replace(
                            /<img.*?alt="(.*?)"[^\>]+>/g,
                            IMAGETEXT_FORMAT_STRING,
                        )
                        .replace(/<(?:a\b[^>]*>|\/a>)/g, '')
                        .replace(/<[^>]*>/g, '')
                        .replace(/\.png|\.jpg/g, '');
                    if (text !== '\n') {
                        rowArray.push(
                            this.decode(text.trim().replace('\n', '')),
                        );
                    }
                });
                tableArray.push(rowArray);
            }
        });

        return tableArray;
    }

    // https://stackoverflow.com/questions/16400641/can-hexadecimal-html-be-systematically-converted-to-unicode-via-javascript
    private static decode(string: string) {
        const decodedHTML = this.decodeHTML(string);
        return decodedHTML
            .replace(/&#(\d+);/g, function (match, num) {
                return String.fromCodePoint(num);
            })
            .replace(/&#x([A-Za-z0-9]+);/g, function (match, num) {
                return String.fromCodePoint(parseInt(num, 16));
            });
    }

    private static decodeHTML(string: string) {
        return string.replace(/&([A-Za-z0-9]+);/g, (match) => {
            console.log(match);
            return (
                HTML_ENTITIES.find((v) => v.name === match)?.value ??
                'undefined'
            );
        });
    }
}

// Gotta work around this code to parse a table to an array
// Use it as a template to translate it to something DOMUtils and typescript can use

// var myTableArray = [];
// $("table#cartGrid tr").each(function() {
//     var arrayOfThisRow = [];
//     var tableData = $(this).find('td');
//     if (tableData.length > 0) {
//         tableData.each(function() { arrayOfThisRow.push($(this).text()); });
//         myTableArray.push(arrayOfThisRow);
//     }
// });

// alert(myTableArray); // alerts the entire array

// alert(myTableArray[0][0]); // Alerts the first tabledata of the first tablerow
