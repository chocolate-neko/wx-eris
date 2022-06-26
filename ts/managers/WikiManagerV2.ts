import DomHandler, { Element } from 'domhandler';
import { DomUtils, Parser } from 'htmlparser2';
import render from 'dom-serializer';
const WIKI_URL: string = 'https://wixoss.fandom.com/api.php?';

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

    public static async parseWikiHTML(search: string): Promise<string> {
        const wikiHTML = await this.fetchData(search);
        let elements: Element[] = [];

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

        const parser = new Parser(handler);
        parser.write(wikiHTML);
        parser.end();

        // console.log(render(elements));
        this.parseTableToArray(elements);

        return wikiHTML;
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
            elements.push(DomUtils.getElementsByTagName('tbody', elem));
            console.log(render(DomUtils.getElementsByTagName('tbody', elem)));
        });
        console.log(elements.length);
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
