export class OGPEntity {
    public thumbnailUrl: string;

    constructor(thumbnailUrl?: string) {
        this.thumbnailUrl = thumbnailUrl ?? 'https://placehold.jp/30/a1a1a1/ffffff/300x150.png?text=NO IMAGE';
    }
}