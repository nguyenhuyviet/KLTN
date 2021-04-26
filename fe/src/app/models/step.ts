
export class Step {
    AssigneFromGroup: boolean
    AssigneeType  :number
    DeadLine :number
    Description :string
    HasDeadline : boolean
    HasField : boolean
    HasTask: boolean
    ProcessStepName = ""
    SortOrder :number
    StepAssignees : any
    StepFields : any
    StepTasks : any
    UserGroupId = null
    constructor() {
        this.AssigneFromGroup = null
        this.AssigneeType = null
        this.DeadLine = null
        this.Description = ""
        this.HasDeadline = null
        this.HasField = null
        this.HasTask = null
        this.ProcessStepName = ""
        this.SortOrder = 1
        this.StepAssignees = []
        this.StepFields = []
        this.StepTasks = []
        this.UserGroupId = null
    }
}
