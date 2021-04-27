using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class Role
    {
        public Role()
        {
            UserInfors = new HashSet<UserInfor>();
        }

        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public virtual ICollection<UserInfor> UserInfors { get; set; }
    }
}
