using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace BusinessAccess.Helpers
{
    public class GetCurrentUser
    {
        public static int GetUserID(List<Claim> listUserClaim)
        {
            var userClaim = listUserClaim.Find(x => x.Type == "UserID");
            if(userClaim != null)
            {
                return int.Parse(userClaim.Value);
            }
            else
            {
                return -1;
            }
        }

        public static string GetUserFullName(List<Claim> listUserClaim)
        {
            var userClaim = listUserClaim.Find(x => x.Type == "FullName");
            if (userClaim != null)
            {
                return userClaim.Value;
            }
            else
            {
                return "";
            }
        }
    }
}
