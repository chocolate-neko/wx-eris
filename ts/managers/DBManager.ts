import { setTimeout } from 'timers/promises';
import sql from './DB';

const SEARCH_URL =
    'https://www.takaratomy.co.jp/products/en.wixoss/card/itemsearch.php?';
const UPDATE_PAGE_QUERY = 'UPDATE wixoss_en_page_count SET page = page + 1';

const FETCH_ERROR_PARITY = 'ohhh... now you fucked up...';

export default class DBManager {
    public static async fetchFromWeb(): Promise<string> {
        const page = await sql`SELECT page FROM wixoss_en_page_count`;
        const url =
            SEARCH_URL + new URLSearchParams({ p: page[0].page.toString() });

        try {
            const req = await fetch(url);
            const json = await req.json();
            if (json.items === undefined || json.items.length == 0)
                return FETCH_ERROR_PARITY;
            return json.items;
        } catch (err) {
            console.log(FETCH_ERROR_PARITY);
            return FETCH_ERROR_PARITY;
        }
    }

    // Only needs to be ran once or occasianlly when there are updates
    public static async pushToDB() {
        const page = await sql`SELECT page FROM wixoss_en_page_count`;

        const json = await this.fetchFromWeb();
        if (json === FETCH_ERROR_PARITY) return;
        sql`
        WITH card_json (doc) AS (
            VALUES (${json}::json)
        )
        INSERT INTO wixoss_en(
            "ID", 
            product_type, 
            "JPN_card_no", 
            card_no, 
            name, 
            color, 
            card_type, 
            rarity, 
            cost, 
            level, 
            limits, 
            master, 
            "LRIG_SIGNI_type", 
            guard_coin_timing, 
            grow_cost, 
            power, 
            content, 
            power_text, 
            fllabor_text, 
            artist, 
            flg, 
            sdate
        )
        SELECT p.*
        FROM card_json l CROSS JOIN LATERAL json_populate_recordset(null::wixoss_en, doc) AS p
        `.execute();

        sql`UPDATE wixoss_en_page_count SET page = page + 1`.execute();
        setTimeout(
            Math.floor(Math.random() * (200 - 100 + 1) + 100),
            console.log(`accessing page ${page[0].page + 1}`),
        ).then(() => this.pushToDB());
    }
}
