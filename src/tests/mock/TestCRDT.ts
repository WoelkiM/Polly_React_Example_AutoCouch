import { AutoCouchCRDT } from "autocouch";
import uuid from "uuid";

type TestObject = {
    testFlag: boolean
}

export class TestCRDT extends AutoCouchCRDT<TestObject> {

    constructor() {
        super("Test", uuid.v4(), {testFlag: false}, undefined)
    }

    public getTestFlag(): boolean {
        return this.getObject().testFlag;
    }

    public setTestFlag(value: boolean): void {
        this.change(obj => {
            obj.testFlag = value;
        })
    }
}

export default TestCRDT;