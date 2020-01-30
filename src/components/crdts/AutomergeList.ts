import uuid from 'uuid'
import { ListCRDT } from  './ListCRDT'
import { AutomergeCRDT } from 'autocouch'
import { AutomergeWrapper } from './AutomergeWrapper'
import { registry } from 'autocouch';
import Automerge from 'automerge'

export class AutomergeList<T> extends AutomergeCRDT<string[]> implements ListCRDT<T> {

    static OBJECT_TYPE: string = 'AutomergeList'
    
    constructor(doc?: Automerge.Doc<any>, ...elements: T[]) {
        if(doc) {
            super("", "", [], doc);
            return;
        }
        super(AutomergeList.OBJECT_TYPE, uuid.v4(), []);
        elements.forEach(value => {
            this.add(value);
        });
    }

    async add(element: T): Promise<ListCRDT<T>> {
        let id = this.makeCRDT(element);
        await this.change(obj => {
            obj.push(id);
        })
        return this;
    }
    
    async remove(element: T): Promise<ListCRDT<T>> {
        let id = this.findId(element);
        await this.change(obj => {
            if(id) {
                let index = obj.indexOf(id);
                if(index >= 0) {
                    obj.splice(index, 1);
                    /*
                    registry.getObject(id).then(object => {
                        object.removeFromDatabase();
                    });
                    */
                }
            }
        });
        return this;
    }

    async getPureList(): Promise<T[]> {
        let promises: Promise<T>[] = await this.getObject().map(id => {
            return registry.getObject(id).then(crdt => {
                if(crdt.getObjectType() === AutomergeWrapper.OBJECT_TYPE) {
                    return crdt.getObject();
                } else {
                    return crdt;
                }
            }).catch(reason => {
                return Promise.reject({
                    err: 'An object in the list could not be loaded from the registry.',
                    id: id,
                    reason: reason
                });
            });
        });
        let res = await Promise.all(promises);
        return res;
    }

    private makeCRDT(element: T): string {
        if(element instanceof AutomergeCRDT) {
            return element.getObjectId();
        } else {
            let crdt = new AutomergeWrapper(element);
            registry.registerObject(crdt.getObjectId(), crdt);
            return crdt.getObjectId();
        }
    }

    private findId(element: T): string | undefined {
        // Does this really work without passing through a promise?
        if(element instanceof AutomergeCRDT) {
            return element.getObjectId();
        } else {
            let list = this.getObject().filter(async value => {
                try {
                    let obj = await registry.getObject(value);
                    if(obj.getObject() === element) {
                        return true;
                    }
                } catch(err) {
                    return false;
                }
            });
            if(list.length < 1) return undefined;
            return list[0];
        }
    }
}

export default AutomergeList;