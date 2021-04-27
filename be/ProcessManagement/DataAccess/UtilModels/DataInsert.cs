using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{
    public class DataInsert
    {
        public object DataSuccess { set; get; }
        public object DataFailed { set; get; }
        public string Message { set; get; }
    }
}
