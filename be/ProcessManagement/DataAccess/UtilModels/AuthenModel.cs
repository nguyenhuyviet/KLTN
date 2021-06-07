using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Models
{
    public class AuthenModel
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        public string Role { get; set; }

        public string Token { get; set; }
        public bool IsFirstTimeLogin { get; set; }

        public AuthenModel(UserInfor user, string token)
        {
            this.UserId = user.UserId;
            this.FullName = user.FullName;

            this.DateOfBirth = user.DateOfBirth;
            this.Email = user.Email;
            this.Phone = user.Phone;
            this.Address = user.Address;
            this.Role = user.Role.RoleName;
            this.Token = token;

            if (user.UserLogin != null && (user.UserLogin.IsFirstTimeLogin == 1 || user.UserLogin.IsFirstTimeLogin == null))
            {
                this.IsFirstTimeLogin = true;

            }


        }
    }

    public partial class UserChangePassword
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }

    }
}
