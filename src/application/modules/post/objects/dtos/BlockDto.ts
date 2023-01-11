export class BlockDto {
    public id: string;
    public type: string;
    public nest: number;
    public content: any;

    constructor({id, type, nest=0, content}:{id: string, type: string, nest?: number, content: any} ) {
        this.id = id;
        this.type = type;
        this.nest = nest;
        this.content = content;
    }
}