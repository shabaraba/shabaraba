
export abstract class Block {
  public id: string;
  public type: string;
  public nest: number = 0;
  constructor(id: string, nest?: number) {
    this.id = id;
    this.nest = nest ?? 0;
  }
}
