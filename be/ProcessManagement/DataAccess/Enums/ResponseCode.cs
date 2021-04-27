using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Enums
{
    public enum ResponseCode
    {
        Success =  1,
        SomeError = 2,
        NotPermission = 3,
        SystemError = 4,
        AuthenFail = 4,
    }
}
