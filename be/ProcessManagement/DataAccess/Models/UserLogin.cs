using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace DataAccess.Models
{
    public partial class UserLogin
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public ulong? IsFirstTimeLogin { get; set; }
        public byte[] PasswordSalt { get; set; }

        [NotMapped]
        public string Password { get; set; }

        public virtual UserInfor User { get; set; }
    }
}
