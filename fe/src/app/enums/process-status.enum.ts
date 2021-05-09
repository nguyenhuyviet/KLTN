
export enum ProcessStatusEnum {
    Active = 1,
    InActive = 2,
    Draf = 3,
    Stop = 4,
}

export const listProcessStatus = [
    {
        ProcessStatus: ProcessStatusEnum.Active,
        Text: "Đang hoạt động",
        Class:'active',
    },
    {
        Class:'inactive', 
        ProcessStatus: ProcessStatusEnum.InActive,
        Text: "Ngưng hoạt động"
    } , 
    {
        Class:'draf',
        ProcessStatus: ProcessStatusEnum.Draf,
        Text: "Phác thảo"
    }, 
    {
        Class:'stop',
        ProcessStatus: ProcessStatusEnum.Stop,
        Text: "Ngừng sử dụng"
    }
]

