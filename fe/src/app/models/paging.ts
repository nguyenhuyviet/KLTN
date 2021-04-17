export class Paging {
    CurrentPage: number;
    PageSize: number;
    Sort: string;
    SortBy: string;
    FilterString: string;
    constructor(){
        this.FilterString = "";
    }
}