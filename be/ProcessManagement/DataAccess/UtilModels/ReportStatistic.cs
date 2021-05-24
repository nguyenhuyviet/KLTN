using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccess.UtilModels
{
    public class ReportStatistic
    {
        public int ProcessId { get; set; }
        public string ProcessName { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public int NumberExecution { get; set; }
        public int CompletionRate { get; set; }
        public int TotalTimeExecution { get; set; }

        public ReportStatistic(Process process)
        {
            this.ProcessId = process.ProcessId;
            this.ProcessName = process.ProcessName;
            this.Description = process.Description;
            this.CreatedBy = process.CreatedBy;

            if (process.ProcessExecutions != null)
            {
                this.NumberExecution = process.ProcessExecutions.Count;
                var numberDone = process.ProcessExecutions.Count(x => x.Status == 2);
                this.CompletionRate = this.NumberExecution != 0 ? numberDone * 100 / this.NumberExecution : 0;

                var doneProcessExe = process.ProcessExecutions.Where(x => x.Status == 2);
                TotalTimeExecution = 0;
                if (doneProcessExe != null)
                {
                    foreach (var doneProcess in doneProcessExe)
                    {

                        TotalTimeExecution += GetDiffDayMinute.Calculate(doneProcess.CreatedDate, doneProcess.CompletedDate);
                    }
                }

            }


        }
    }


    public class ReportStatisticDetail
    {
        public int ProcessId { get; set; }
        public string ProcessName { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public int NumberExecution { get; set; }
        public int CompletionRate { get; set; }
        public int TotalTimeExecution { get; set; }
        public int NumberReject { get; set; }
        public int NumberExprire { get; set; }
        public List<StepStatistic> ListStep { get; set; }

        public ReportStatisticDetail(Process process)
        {
            this.ProcessId = process.ProcessId;
            this.ProcessName = process.ProcessName;
            this.Description = process.Description;
            this.CreatedBy = process.CreatedBy;

            if (process.ProcessExecutions != null)
            {
                this.NumberExecution = process.ProcessExecutions.Count;
                var numberDone = process.ProcessExecutions.Count(x => x.Status == 2);
                var numberUnDone = process.ProcessExecutions.Count(x => x.Status != 1);
                this.CompletionRate = numberUnDone != 0 ? numberDone * 100 / numberUnDone : 0;

                this.NumberReject = process.ProcessExecutions.Count(x => x.Status == 3);
                this.NumberExprire = process.ProcessExecutions.Count(x => x.Status == 4);
                var doneProcessExe = process.ProcessExecutions.Where(x => x.Status == 2);
                TotalTimeExecution = 0;
                if (doneProcessExe != null)
                {
                    foreach (var doneProcess in doneProcessExe)
                    {

                        TotalTimeExecution += GetDiffDayMinute.Calculate(doneProcess.CreatedDate, doneProcess.CompletedDate);
                    }
                }

            }

            if (process.ProcessSteps != null)
            {
                foreach (var step in process.ProcessSteps)
                {
                    var stepStat = new StepStatistic(step);
                    if (ListStep == null)
                    {
                        ListStep = new List<StepStatistic>();
                    }
                    ListStep.Add(stepStat);
                }

            }
        }
       
    }

    public class StepStatistic
    {
        public int ProcessStepId { get; set; }
        public string ProcessStepName { get; set; }
        public string Description { get; set; }
        public int NumberReject { get; set; }
        public int NumberExprire { get; set; }

        public StepStatistic(ProcessStep step)
        {
            ProcessStepId = step.ProcessStepId;
            ProcessStepName = step.ProcessStepName;
            Description = step.Description;

            this.NumberReject = step.StepExecutions.Count(x => x.IsReject.HasValue && x.IsReject.Value && (x.IsExpire.HasValue && !x.IsExpire.Value || !x.IsExpire.HasValue));
            this.NumberExprire = step.StepExecutions.Count(x => x.IsExpire.HasValue && x.IsExpire.Value && (x.IsReject.HasValue && !x.IsReject.Value || !x.IsReject.HasValue));

        }
    }

    public class GetDiffDayMinute
    {
        public static int Calculate(DateTime? dayOne, DateTime? dayTwo)
        {
            if (dayOne == null || dayTwo == null)
            {
                return 0;
            }
            else
            {
                DateTime date1 = dayOne ?? DateTime.Now;
                DateTime date2 = dayTwo ?? DateTime.Now;
                TimeSpan diffMs = date2 - date1; // milliseconds between now & Christmas
                return (int)Math.Floor(diffMs.TotalMinutes);
            }
        }
    }
}
