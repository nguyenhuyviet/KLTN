using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class AssigneeUser
    {
        public int AssingeeUserId { get; set; }
        public int? ProcessStepId { get; set; }
        public string UserId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
