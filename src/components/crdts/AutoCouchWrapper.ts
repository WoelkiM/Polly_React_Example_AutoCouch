import { AutoCouchCRDT, getDescendantProp } from 'autocouch'
import uuid from 'uuid'
import Automerge from 'automerge'

export class AutoCouchWrapper extends AutoCouchCRDT<any> {

    static OBJECT_TYPE: string = 'AutomergeWrapper'

    constructor(object: any, doc?: Automerge.Doc<any>) {
        if(doc) {
            super("", "", {}, doc);
        } else {
            super(AutoCouchWrapper.OBJECT_TYPE, uuid.v4(), object);
        }
    }

    public getReadOnlyProperty(path: string): any {
        return getDescendantProp(this.getObject(), path);
    }
}

export default AutoCouchWrapper;