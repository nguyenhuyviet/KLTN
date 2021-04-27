using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class ProcessStep
    {
        public ProcessStep()
        {
            ProcessExecutions = new HashSet<ProcessExecution>();
            StepAssignees = new HashSet<StepAssignee>();
            StepExecutions = new HashSet<StepExecution>();
            StepFields = new HashSet<StepField>();
            StepTasks = new HashSet<StepTask>();
        }

        public int ProcessStepId { get; set; }
        public string ProcessStepName { get; set; }
        public int? SortOrder { get; set; }
        public string Description { get; set; }
        public ulong? HasTask { get; set; }
        public int? AssigneeType { get; set; }
        public ulong? HasField { get; set; }
        public int? ProcessId { get; set; }
        public ulong? HasDeadline { get; set; }
        public int? DeadLine { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? StepSortOrder { get; set; }

        public virtual Process Process { get; set; }
        public virtual ICollection<ProcessExecution> ProcessExecutions { get; set; }
        public virtual ICollection<StepAssignee> StepAssignees { get; set; }
        public virtual ICollection<StepExecution> StepExecutions { get; set; }
        public virtual ICollection<StepField> StepFields { get; set; }
        public virtual ICollection<StepTask> StepTasks { get; set; }
    }
}
