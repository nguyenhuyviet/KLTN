using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{


    public class Paging
    {
        public int CurrentPage { set; get; }
        public int PageSize { set; get; }

        public string Sort { set; get; }
        public string SortBy { set; get; }

        public string FilterString { set; get; }

        public ExtraCondition ExtraCondition { set; get; }

    }

    public class ExtraCondition
    {
        public int Status { set; get; }
        public int ProcessRelatedType { set; get; } // 0 => all, 1 toi tham gia, 2 toi tao

        public int ProcessGroupId { set; get; }
        public int UserGroupId { set; get; }
    }
    public class Page
    {
       
        public int pageNumber { set; get; }
        public int size { set; get; }
        public int totalElements { set; get; }
        public int totalPages { set; get; }

    }

    public class Filter
    {
        public string Value { set; get; }
        public string Property { set; get; }
    }

}