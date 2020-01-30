export interface ListCRDT<T> {
    add(element : T) : Promise<ListCRDT<T>>;
    remove(element : T) : Promise<ListCRDT<T>>;
    getPureList() : Promise<T[]>;
    on(func: (data?: any) =>  void): void;
    off(func: (data?: any) =>  void): void;
}

export interface ListCRDTConstructor<T> {
    new<T>(...elements : T[]) : ListCRDT<T>;
}

export default ListCRDT;