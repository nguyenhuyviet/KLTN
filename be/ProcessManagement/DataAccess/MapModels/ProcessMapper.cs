using System;
using System.Collections.Generic;
using System.Text;
using DataAccess.Models;
namespace DataAccess.MapModels
{
    class ProcessMapper
    {

        public ProcessMapper()
        {

        }

        public int ProcessId { get; set; }
        public string ProcessName { get; set; }
        public string ProcessImage { get; set; }
        public int? ProcessStatus { get; set; }
        public string Description { get; set; }
        public int? ProcessGroupId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual ProcessGroup ProcessGroup { get; set; }
        public virtual ICollection<ProcessExecution> ProcessExecutions { get; set; }
        public virtual ICollection<ProcessStep> ProcessSteps { get; set; }
    }
}
