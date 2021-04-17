
export enum ProcessStatusEnum {
    Active = 1,
    InActive = 2,
    Draf = 3,
    Stop = 4,
}

export const listProcessStatus = [
    {
        ProcessStatus: ProcessStatusEnum.Active,
        Text: "Đang hoạt động"
    },
    {
        ProcessStatus: ProcessStatusEnum.InActive,
        Text: "Ngưng hoạt động"
    } , 
    {
        ProcessStatus: ProcessStatusEnum.Draf,
        Text: "Phác thảo"
    }, 
    {
        ProcessStatus: ProcessStatusEnum.Stop,
        Text: "Ngừng sử dụng"
    }
]

