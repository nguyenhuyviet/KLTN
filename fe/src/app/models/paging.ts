export class Paging {
    CurrentPage: number;
    PageSize: number;
    Sort: string;
    SortBy: string;
    FilterString: string;
    ExtraCondition: any;
    constructor(){
        this.FilterString = "";
        this.CurrentPage = 1;
        this.PageSize = 10;
    }
}