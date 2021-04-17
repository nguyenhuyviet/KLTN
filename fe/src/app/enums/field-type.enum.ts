
export enum FieldType {
   ShortText = 1,
   LongText = 2,
   Hour = 3,
   Date = 4,
   DateTime = 5,
   Number = 6,
   Dropdown = 7,
   Checkbox = 8,
   File = 9,
   YesNo = 10,
   Link = 11,
}

export const FieldTypeEntity = [
    {
        Type: FieldType.ShortText,
        Text: "Văn bản ngắn"
    }, 
    {
        Type: FieldType.LongText,
        Text: "Văn bản dài"
    }, 
    {
        Type: FieldType.Number,
        Text: "Số"
    }, 
    {
        Type: FieldType.Hour,
        Text: "Giờ"
    }, 
    {
        Type: FieldType.Date,
        Text: "Ngày tháng"
    }, 
    {
        Type: FieldType.DateTime,
        Text: "Ngày tháng giờ"
    }, 
    {
        Type: FieldType.Dropdown,
        Text: "Dropdown"
    },
     {
        Type: FieldType.Checkbox,
        Text: "Check box"
    }, 
    {
        Type: FieldType.File,
        Text: "File"
    }, 
    {
        Type: FieldType.YesNo,
        Text: "Yes/No"
    }, 
    {
        Type: FieldType.Link,
        Text: "Liên kết"
    },

]
 