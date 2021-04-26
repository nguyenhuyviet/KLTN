export class StepExecution {

    StepExecutionId: number;
    StepExecutionData: string;
    ProcessExecutionId: number;
    IsReject: boolean
    RejectReason: string;
    NextAssigneeId: number;
    PrevAssigneeId: number;
    CurrentAssigneeId: number;
    CurrentAssignee: any;
    NextAssignee: any;
    PrevAssignee: any;
    ProcessExecution: any;


}
