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

    public static async parseWikiHTML(search: string) {
        const wikiHTML = await this.fetchData(search);
    }
}
