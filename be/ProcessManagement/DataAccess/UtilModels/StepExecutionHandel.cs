using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.UtilModels
{
    public class StepExecutionHandel
    {
        public ProcessStep CurrentStep { get; set; }
        public List<StepExecution> ListStep { get; set; }

        public bool IsHandle { get; set; } 
        public int? Status { get; set; } 
        public string ProcessName { get; set; }
    }
}
