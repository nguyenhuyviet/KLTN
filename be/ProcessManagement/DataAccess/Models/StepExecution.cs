using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class StepExecution
    {
        public int StepExecutionId { get; set; }
        public string StepExecutionData { get; set; }
        public int? ProcessExecutionId { get; set; }
        public ulong? IsReject { get; set; }
        public string RejectReason { get; set; }
        public int? NextAssigneeId { get; set; }
        public int? PrevAssigneeId { get; set; }
        public int? CurrentAssigneeId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ProcessStepId { get; set; }

        public virtual UserInfor CurrentAssignee { get; set; }
        public virtual UserInfor NextAssignee { get; set; }
        public virtual UserInfor PrevAssignee { get; set; }
        public virtual ProcessExecution ProcessExecution { get; set; }
        public virtual ProcessStep ProcessStep { get; set; }
    }
}
