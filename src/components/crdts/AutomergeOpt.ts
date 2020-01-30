import {OptCRDT} from './OptCRDT';
import Automerge from 'automerge';
import uuid from 'uuid'
import { AutomergeCRDT } from 'autocouch';

export type OptType = {
    id: any,
    title: string,
    votes: {[username: string]: boolean}
}

export class AutomergeOpt extends AutomergeCRDT<OptType> implements OptCRDT {

    static OBJECT_TYPE: string = 'AutomergeOpt';

    constructor(id: any, title: string, chosen: boolean, votes: number, doc?: Automerge.Doc<any>) {
        let opt = {
            id: id,
            title: title,
            chosen: chosen,
            votes: {}
        };
        if(doc) {
            super('', '', opt, doc);
            return;
        }
        super(AutomergeOpt.OBJECT_TYPE, uuid.v4(), opt);
    }

    getChosen(username: string): boolean {
        let chosen = this.getObject().votes[username];
        return chosen ? chosen : false;
    }

    getVotes(): number {
        return Object.values(this.getObject().votes).filter((value) => {
            return value;
        }).length;
    }

    getId() : any {
        return this.getObject().id;
    }

    getTitle(): string {
        return this.getObject().title;
    }

    async mark(username: string): Promise<void> {
        await this.change(doc => {
            doc.votes[username] = true;
        });
    }

    async unmark(username: string): Promise<void> {
        await this.change(doc => {
            doc.votes[username] = false;
        });
    }
}

export default AutomergeOpt;