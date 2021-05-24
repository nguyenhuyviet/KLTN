using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class ProcessExecution
    {
        public ProcessExecution()
        {
            StepExecutions = new HashSet<StepExecution>();
        }

        public int ProcessExecutionId { get; set; }
        public string ProcessExecutionName { get; set; }
        public int? ProcessSettingId { get; set; }
        public int? CurrentStepId { get; set; }
        public int? OwnerId { get; set; }
        public int? Status { get; set; }
        public int? Priority { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public virtual ProcessStep CurrentStep { get; set; }
        public virtual UserInfor Owner { get; set; }
        public virtual Process ProcessSetting { get; set; }
        public virtual ICollection<StepExecution> StepExecutions { get; set; }
    }
}
