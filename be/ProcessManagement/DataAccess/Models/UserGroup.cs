using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class UserGroup
    {
        public UserGroup()
        {
            StepAssignees = new HashSet<StepAssignee>();
            UserGroupDetails = new HashSet<UserGroupDetail>();
        }

        public int UserGroupId { get; set; }
        public string UserGroupName { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual ICollection<StepAssignee> StepAssignees { get; set; }
        public virtual ICollection<UserGroupDetail> UserGroupDetails { get; set; }
    }
}
