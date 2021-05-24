using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace DataAccess.Models
{
    public partial class StepField
    {
        public int StepFieldId { get; set; }
        public string FieldName { get; set; }
        public int? SortOrder { get; set; }
        public string Description { get; set; }
        public bool? IsRequired { get; set; }
        public int? Type { get; set; }
        public string DataSetting { get; set; }
        public int? ProcessStepId { get; set; }

        public virtual ProcessStep ProcessStep { get; set; }
        [NotMapped]
        public int State { get; set; }
    }
}
