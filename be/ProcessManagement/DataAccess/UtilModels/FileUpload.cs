using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace DataAccess.UtilModels
{
    public class FileUpload
    {
        public Guid FileId { set; get; }
        public string PathName { set; get; }
        public string FileName { set; get; }

        public FileUpload (Guid id, string fileName)
        {
            this.FileId = id;
            this.FileName = fileName;

            var stringId = id.ToString();
            stringId  = stringId.Replace("-","");
            this.PathName = stringId + "_" + fileName;
        }
    }
}
