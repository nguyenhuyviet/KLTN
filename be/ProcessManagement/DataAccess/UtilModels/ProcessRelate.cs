using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{
    public class ProcessRelate
    {
        public string ProcessName { get; set; }
        public int? ProcessExecutionId { get; set; }
        public string CurrentStepName { get; set; }
        public string StepDescription { get; set; }
        public string OwnerName { get; set; }
        public int? OwnerId { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
