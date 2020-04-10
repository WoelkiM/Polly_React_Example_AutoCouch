import uuid from 'uuid'
import { ListCRDT } from  './ListCRDT'
import { AutoCouchCRDT, registry } from 'autocouch'
import { AutoCouchWrapper } from './AutoCouchWrapper'
import Automerge from 'automerge'

export class AutoCouchList<T> extends AutoCouchCRDT<string[]> implements ListCRDT<T> {

    static OBJECT_TYPE: string = 'AutomergeList'
    
    constructor(doc?: Automerge.Doc<any>, ...elements: T[]) {
        if(doc) {
            super("", "", [], doc);
            return;
        }
        super(AutoCouchList.OBJECT_TYPE, uuid.v4(), []);
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
        let promises: Promise<T>[] = this.getObject().map(async (id: string) => {
            return registry.getObject(id).then(crdt => {
                if(crdt.getObjectType() === AutoCouchWrapper.OBJECT_TYPE) {
                    return crdt.getObject() as T;
                } else {
                    return crdt as unknown as T;
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
        if(element instanceof AutoCouchCRDT) {
            return element.getObjectId();
        } else {
            let crdt = new AutoCouchWrapper(element);
            registry.registerObject(crdt.getObjectId(), crdt);
            return crdt.getObjectId();
        }
    }

    private findId(element: T): string | undefined {
        // Does this really work without passing through a promise?
        if(element instanceof AutoCouchCRDT) {
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

export default AutoCouchList;