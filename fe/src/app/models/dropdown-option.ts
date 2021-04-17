import {v4 as uuid} from "uuid";

export class DropdownOption {
    OptionName: string;
    OptionId: string
    constructor(){
        this.OptionId = uuid();
        this.OptionName = "";
    }
}