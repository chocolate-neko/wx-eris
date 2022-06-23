import { readdir, readdirSync, readFileSync, stat } from 'fs';
import * as p from 'path';

let pathArr: string[] = [];
export default class FileManager {
    public static recurssiveWalk(
        path: string,
        filter?: (f: string) => boolean,
    ): string[] {
        const files = readdirSync(path, {
            withFileTypes: true,
        });
        for (const file of files) {
            if (file.isDirectory()) {
                this.recurssiveWalk(p.join(path, file.name), filter);
            } else {
                if (
                    typeof filter === undefined ||
                    (filter && filter(file.name))
                ) {
                    console.log(p.join(__dirname, '../../', path, file.name));
                    pathArr.push(p.join(__dirname, '../../', path, file.name));
                }
            }
        }
        return pathArr;
    }
}
