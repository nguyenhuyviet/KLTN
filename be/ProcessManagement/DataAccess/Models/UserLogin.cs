using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class UserLogin
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public ulong? IsFirstTimeLogin { get; set; }

        public virtual UserInfor User { get; set; }
    }
}
