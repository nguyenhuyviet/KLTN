using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{
    public class DataInitProcessExe
    {
        public int ProcessSettingId { get; set; }
        public int ProcessExeId { get; set; }
        public int ProcessStepId { get; set; }
        public int AssigneeId { get; set; }
        public string StepExecutionData { get; set; }
        public string RejectReason { get; set; }
    }
}
