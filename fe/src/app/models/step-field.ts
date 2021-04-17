import { FieldType } from "../enums/field-type.enum";

export class StepField {

    StepFieldId: number;
    FieldName: string;
    SortOrder: number;
    Description: string;
    IsRequired: boolean;
    Type: number;
    DataSetting: string;
    DataSettingObj: any;
    ProcessStepId: number;

    constructor() {

        this.FieldName = "";
        this.SortOrder = 0;
        this.Description = "";
        this.IsRequired = false;
        this.Type = FieldType.ShortText;
        this.DataSetting = `{"Placeholder": "", "LinkName":"","LinkTo":"","ListOption":[]}`;
        this.DataSettingObj = JSON.parse(this.DataSetting);
    }
}