using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace DataAccess.Models
{
    public partial class StepTask
    {
        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public int? SortOrder { get; set; }
        public int? ProcessStepId { get; set; }

        public virtual ProcessStep ProcessStep { get; set; }

        [NotMapped]
        public int State { get; set; }
    }
}
