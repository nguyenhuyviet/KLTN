using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class UserInfor
    {
        public UserInfor()
        {
            ProcessExecutions = new HashSet<ProcessExecution>();
            StepAssignees = new HashSet<StepAssignee>();
            StepExecutionCurrentAssignees = new HashSet<StepExecution>();
            StepExecutionNextAssignees = new HashSet<StepExecution>();
            StepExecutionPrevAssignees = new HashSet<StepExecution>();
            UserGroupDetails = new HashSet<UserGroupDetail>();
        }

        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int? RoleId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual Role Role { get; set; }
        public virtual UserLogin UserLogin { get; set; }
        public virtual ICollection<ProcessExecution> ProcessExecutions { get; set; }
        public virtual ICollection<StepAssignee> StepAssignees { get; set; }
        public virtual ICollection<StepExecution> StepExecutionCurrentAssignees { get; set; }
        public virtual ICollection<StepExecution> StepExecutionNextAssignees { get; set; }
        public virtual ICollection<StepExecution> StepExecutionPrevAssignees { get; set; }
        public virtual ICollection<UserGroupDetail> UserGroupDetails { get; set; }
    }
}
