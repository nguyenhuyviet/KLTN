using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace DataAccess.Models
{
    public partial class StepAssignee
    {
        public int StepAssingeeId { get; set; }
        public int? ProcessStepId { get; set; }
        public int? UserId { get; set; }
        public int? UserGroupId { get; set; }

        public virtual ProcessStep ProcessStep { get; set; }
        public virtual UserInfor User { get; set; }
        public virtual UserGroup UserGroup { get; set; }

        [NotMapped]
        public int State { get; set; }
    }
}
