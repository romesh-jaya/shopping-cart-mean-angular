export class ProductChangeLog {
    constructor(public submittedBy: string, public status: string, public comment, public reviewedBy: string,
        public dateSubmitted, public serverId?: string) { }
}
