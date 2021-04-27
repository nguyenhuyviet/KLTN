using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{
    public class PagingResult
    {
        public int CurrentPage { set; get; }
        public int PageSize { set; get; }

        public object PageData { set; get; }
        public int TotalRecord { set; get; }
}
}
