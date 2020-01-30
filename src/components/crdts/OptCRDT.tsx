export interface OptCRDT {
    mark(username: string) : Promise<void>;
    unmark(username: string): Promise<void>;
    getChosen(username: string): boolean;
    getVotes(): number;
    getId() : any;
    getTitle() : string;
    on(func: (data?: any) =>  void): void;
    off(func: (data?: any) =>  void): void;
}

export interface OptCRDTConstructor {
    new (id: any, title: string, chosen: boolean, votes: number): OptCRDT;
}

export default OptCRDT;