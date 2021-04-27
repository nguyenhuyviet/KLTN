using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class UserGroupDetail
    {
        public int Id { get; set; }
        public int? UserGroupId { get; set; }
        public int? UserId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual UserInfor User { get; set; }
        public virtual UserGroup UserGroup { get; set; }
    }
}
