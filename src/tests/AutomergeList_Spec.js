import TestCRDT from './mock/TestCRDT';

describe("AutomergeList_Suite", function() {
    afterAll(() => {
        //db.clean();
    });
    describe("An element", function() {
        var list;
        beforeEach(() => {
            list = new AutomergeList();
        });
        afterEach(() => {
            list.removeFromDatabase();
        });
        it("is added in a simple form", function () {
            list.add(0);
            let pure = list.getPureList();
            expect(pure.length).toBe(1);
            expect(pure[0]).toBe(0);
        });
        it("is added in a CRDT form", function () {
            let test = new TestCRDT();
            test.setTestFlag(true);
            list.add(test);
            let pure = list.getPureList();
            expect(pure.length).toBe(1);
            expect(pure[0].testFlag).toBeTrue();
            expect(pure[0]).toEqual(test);
        });
        it("is removed", function () {
            list.add(0);
            list.remove(0);
            expect(list.getPureList().length).toBe(0);
        });
    });
});