﻿
using DataAccess.Enums;
using DataAccess.Infrastructure;
using DataAccess.Models;
using DataAccess.UtilModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json;
using MoreLinq;

namespace BusinessAccess.Services
{
    public interface IProcessExecutionService
    {


        ServiceResponse InitProcessExe(DataInitProcessExe data, int currentUserID);
        ServiceResponse NextStep(DataInitProcessExe data, int currentUserID);
        ServiceResponse RejectStep(DataInitProcessExe data, int currentUserID);
        ServiceResponse GetProcessRelated(Paging paging, int currentUserID);
        ServiceResponse GetProcessNeedMyApproval(Paging paging, int currentUserID);
        ServiceResponse GetStepExecution(int processExeId, int currentUserID);
        void Save();

    }


    public class ProcessExecutionService : IProcessExecutionService
    {
        IRepository<Process> _processRepository;
        IRepository<ProcessStep> _stepRepository;
        IRepository<ProcessExecution> _processExeRepository;
        IRepository<StepExecution> _stepExeRepository;

        IUnitOfWork unitOfWork;


        public ProcessExecutionService(IRepository<Process> processRepository, IRepository<ProcessExecution> processExeRepository,
        IRepository<StepExecution> stepExeRepository,
        IRepository<ProcessStep> stepRepository, IUnitOfWork unitOfWork)
        {
            this._processRepository = processRepository;

            this._stepRepository = stepRepository;
            this._processExeRepository = processExeRepository;
            this._stepExeRepository = stepExeRepository;
            this.unitOfWork = unitOfWork;
        }

        public ServiceResponse GetProcessRelated(Paging paging, int currentUserID)
        {
            ServiceResponse res = new ServiceResponse();
            string[] includes = new string[3] { "ProcessExecution.CurrentStep", "ProcessStep", "ProcessExecution.Owner" };

            IEnumerable<StepExecution> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }
            if (!String.IsNullOrEmpty(paging.FilterString))
            {
                if (paging.ExtraCondition.ProcessRelatedType == 1)
                {
                    query = _stepExeRepository.GetMulti(x => x.CurrentAssigneeId == currentUserID
                           && x.ProcessExecution.ProcessExecutionName.ToUpper().Contains(paging.FilterString.ToUpper()), includes);
                }
                else if (paging.ExtraCondition.ProcessRelatedType == 2)
                {
                    query = _stepExeRepository.GetMulti(x => x.ProcessExecution.OwnerId == currentUserID
                           && x.ProcessExecution.ProcessExecutionName.ToUpper().Contains(paging.FilterString.ToUpper()), includes);
                }
                else
                {
                    query = _stepExeRepository.GetMulti(x => x.CurrentAssigneeId == currentUserID || x.ProcessExecution.OwnerId == currentUserID
                            && x.ProcessExecution.ProcessExecutionName.ToUpper().Contains(paging.FilterString.ToUpper()), includes);
                }

            }
            else
            {
                if (paging.ExtraCondition.ProcessRelatedType == 1)
                {
                    query = _stepExeRepository.GetMulti(x => x.CurrentAssigneeId == currentUserID, includes);
                }
                else if (paging.ExtraCondition.ProcessRelatedType == 2)
                {
                    query = _stepExeRepository.GetMulti(x => x.ProcessExecution.OwnerId == currentUserID, includes);
                }
                else
                {
                    query = _stepExeRepository.GetMulti(x => x.CurrentAssigneeId == currentUserID || x.ProcessExecution.OwnerId == currentUserID, includes);
                }

            }

            query = query.OrderByDescending(x => x.CreatedDate).DistinctBy(x => x.ProcessExecutionId);

            data.TotalRecord = query.Count();
            var listProcessExe = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize).ToList();
            data.PageData = ConvertData(listProcessExe);
            res.OnSuccess(data);
            return res;

        }
        private List<ProcessRelate> ConvertData(List<StepExecution> list)
        {
            List<ProcessRelate> result = new List<ProcessRelate>();

            foreach (var processExe in list)
            {
                if (processExe.ProcessStep != null && processExe.ProcessExecution != null)
                {

                    ProcessRelate pE = new ProcessRelate
                    {
                        CurrentStepName = processExe.ProcessExecution.CurrentStep != null ? processExe.ProcessExecution.CurrentStep.ProcessStepName : "Đã hoàn thành",
                        ProcessName = processExe.ProcessExecution.ProcessExecutionName,
                        OwnerName = processExe.ProcessExecution.Owner.FullName,
                        OwnerId = processExe.ProcessExecution.OwnerId,
                        StepDescription = processExe.ProcessExecution.CurrentStep != null ? processExe.ProcessExecution.CurrentStep.Description : "Đã hoàn thành",
                        ProcessExecutionId = processExe.ProcessExecutionId,
                        Status = processExe.ProcessExecution.Status,
                        CreatedDate = processExe.ProcessExecution.CreatedDate
                    };
                    result.Add(pE);
                }
            }
            return result;
        }
        public ServiceResponse InitProcessExe(DataInitProcessExe data, int currentUserID)
        {
            DateTime now = DateTime.Now;


            ServiceResponse res = new ServiceResponse();
            if (data == null)
            {
                res.OnError("Data empty");
                return res;
            }
            var process = _processRepository.GetSingleById(data.ProcessSettingId);

            var stepExe = new StepExecution();
            stepExe.StepExecutionData = data.StepExecutionData;
            stepExe.NextAssigneeId = data.AssigneeId;
            stepExe.CurrentAssigneeId = currentUserID;
            stepExe.CreatedDate = now;
            stepExe.CompletedDate = now;
            stepExe.ProcessStepId = data.ProcessStepId;

            var nextStepExe = new StepExecution();
            nextStepExe.CurrentAssigneeId = data.AssigneeId;
            nextStepExe.CreatedDate = now;


            var processExe = new ProcessExecution();
            processExe.ProcessExecutionName = process.ProcessName;
            processExe.ProcessSettingId = process.ProcessId;
            processExe.CurrentStepId = data.ProcessStepId;
            processExe.OwnerId = currentUserID;
            processExe.Status = 1;
            processExe.CreatedDate = now;
            processExe.StepExecutions = new List<StepExecution>() { stepExe };

            var nextStep = GetNextStep(data.ProcessStepId, process.ProcessId);
            if (nextStep != null)
            {
                processExe.CurrentStepId = nextStep.ProcessStepId;
                nextStepExe.ProcessStepId = nextStep.ProcessStepId;
                processExe.StepExecutions.Add(nextStepExe);
            }
            else
            {
                processExe.CurrentStepId = -999;
            }


            _processExeRepository.Add(processExe);
            this.Save();
            res.OnSuccess(processExe);
            return res;
        }


        private ProcessStep GetNextStep(int prevStepId, int processId)
        {
            ProcessStep result = new ProcessStep();
            IEnumerable<ProcessStep> lstResult = new List<ProcessStep>();
            ProcessStep currentStep = _stepRepository.GetSingleById(prevStepId);
            if (currentStep != null)
            {
                lstResult = _stepRepository.GetMulti(x => x.ProcessId == processId && x.SortOrder > currentStep.SortOrder).ToList();
            }

            if (lstResult != null && lstResult.Count() != 0)
            {
                lstResult.OrderBy(x => x.SortOrder);
                result = lstResult.First();
            }
            else
            {
                result = null;
            }


            return result;
        }

        public void Save()
        {
            unitOfWork.Commit();
        }

        public ServiceResponse GetStepExecution(int processExeId, int currentUserID)
        {
            ServiceResponse res = new ServiceResponse();

            string[] includes = new string[4] { "StepExecutions.CurrentAssignee", "CurrentStep.StepFields", "CurrentStep.StepTasks", "StepExecutions.ProcessStep" };
            var processExe = _processExeRepository.GetSingleByCondition(x => x.ProcessExecutionId == processExeId, includes);

            // kiem tra xem dung nguoi nay duoc giao hay khong


            // neeus chua done
            if (processExe.Status == 1)
            {

                res = GetStepExecutionForHandle(processExe, currentUserID);
                return res;
            }
            else
            {
                res = GetStepExecutionForView(processExe, currentUserID);
                return res;
            }


        }

        private ServiceResponse GetStepExecutionForView(ProcessExecution processExe, int currentUserID)
        {
            ServiceResponse res = new ServiceResponse();


            var stepExe = processExe.StepExecutions.OrderByDescending(x => x.ProcessStep.SortOrder).First();

            if (stepExe != null)
            {
                if (processExe.CurrentStep != null)
                {
                    processExe.CurrentStep.ProcessExecutions = null;

                }

                var listStepExe = new List<StepExecution>();

                foreach (var item in processExe.StepExecutions)
                {
                    item.ProcessExecution = null;
                    if (item.CurrentAssignee != null)
                    {

                        item.CurrentAssignee.ProcessExecutions = null;
                    }

                    if (item.NextAssigneeId != null && item.NextAssigneeId != -999)
                    {
                        listStepExe.Add(item);
                    }
                }
                var result = new StepExecutionHandel()
                {
                    CurrentStep = stepExe.ProcessStep,
                    ListStep = listStepExe,
                    IsHandle = false,
                    Status = processExe.Status,
                    ProcessName = processExe.ProcessExecutionName

                };

                res.OnSuccess(result);
                return res;
            }
            else
            {
                res.OnError("Not permittion");
                return res;
            }
        }
        private ServiceResponse GetStepExecutionForHandle(ProcessExecution processExe, int currentUserID)
        {
            ServiceResponse res = new ServiceResponse();
            // kiem tra xem dung nguoi nay duoc giao hay khong
            var lastProcess = processExe.StepExecutions.OrderByDescending(x => x.ProcessStep.SortOrder).First();

            if (lastProcess.CurrentAssigneeId == currentUserID)
            {
                if (processExe.CurrentStep != null)
                {
                    processExe.CurrentStep.ProcessExecutions = null;

                }

                var listStepExe = new List<StepExecution>();

                foreach (var item in processExe.StepExecutions)
                {
                    item.ProcessExecution = null;
                    if (item.CurrentAssignee != null)
                    {

                        item.CurrentAssignee.ProcessExecutions = null;
                    }

                    if (item.NextAssigneeId != null && item.NextAssigneeId != -999)
                    {
                        listStepExe.Add(item);
                    }
                }
                var result = new StepExecutionHandel()
                {
                    CurrentStep = processExe.CurrentStep,
                    ListStep = listStepExe,
                    IsHandle = true,
                    Status = processExe.Status,
                    ProcessName = processExe.ProcessExecutionName
                };

                res.OnSuccess(result);
                return res;
            }
            else
            {
                res = GetStepExecutionForView(processExe, currentUserID);
                return res;
            }




        }

        public ServiceResponse NextStep(DataInitProcessExe data, int currentUserID)
        {
            DateTime now = DateTime.Now;


            ServiceResponse res = new ServiceResponse();
            if (data == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }

            var stepExe = _stepExeRepository.GetSingleByCondition(x => x.NextAssigneeId == null
                          && x.CurrentAssigneeId == currentUserID && x.ProcessStepId == data.ProcessStepId);
            if (stepExe == null)
            {
                res.OnError("Không có dữ liệu");
                return res;
            }
            stepExe.StepExecutionData = data.StepExecutionData;

            var nextStepExe = new StepExecution();
            nextStepExe.CurrentAssigneeId = data.AssigneeId;
            nextStepExe.CreatedDate = now;

            var process = _processRepository.GetSingleById(data.ProcessSettingId);
            var processExe = _processExeRepository.GetSingleById(data.ProcessExeId);

            var nextStep = GetNextStep(data.ProcessStepId, process.ProcessId);
            if (nextStep != null)
            {
                if ( data.AssigneeId == 0 || data.AssigneeId == null)
                {
                    res.OnError("Lỗi người thực hiện");
                    return res;
                }
                processExe.CurrentStepId = nextStep.ProcessStepId;

                stepExe.NextAssigneeId = data.AssigneeId;
                stepExe.CurrentAssigneeId = currentUserID;
                stepExe.CompletedDate = now;

                nextStepExe.ProcessStepId = nextStep.ProcessStepId;
                nextStepExe.ProcessExecutionId = data.ProcessExeId;
                nextStepExe.CurrentAssigneeId = data.AssigneeId;

                _stepExeRepository.Add(nextStepExe);
                _stepExeRepository.AddOrUpdate(stepExe);
                _processExeRepository.Update(processExe);
            }
            else
            {
                processExe.CurrentStepId = null;
                stepExe.NextAssigneeId = null;
                stepExe.CompletedDate = now;

                processExe.CompletedDate = now;
                processExe.Status = 2;
                _processExeRepository.Update(processExe);
            }


            this.Save();
            res.OnSuccess(processExe);
            return res;
        }

        public ServiceResponse GetProcessNeedMyApproval(Paging paging, int currentUserID)
        {
            ServiceResponse res = new ServiceResponse();
            string[] includes = new string[3] { "ProcessExecution.CurrentStep", "ProcessStep", "ProcessExecution.Owner" };

            IEnumerable<StepExecution> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }

            query = _stepExeRepository.GetMulti(x => x.NextAssigneeId == null && x.CurrentAssigneeId == currentUserID && x.ProcessExecution.Status != 3, includes);
            query = query.OrderByDescending(x => x.CreatedDate);



            data.TotalRecord = query.Count();
            var listProcessExe = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize).ToList();

            foreach (var item in listProcessExe)
            {

                if (item.ProcessExecution.Status != 4 && item.ProcessExecution.CurrentStep != null)
                {
                    var step = _stepRepository.GetSingleById(item.ProcessExecution.CurrentStep.ProcessStepId);
                    if (step != null && step.HasDeadline.HasValue && step.HasDeadline.Value && step.DeadLine != null)
                    {

                        DateTime now = DateTime.Now;
                        var diff = GetDiffDayMinute(item.CreatedDate ?? now, now);

                        var remain = step.DeadLine - diff;

                        if (remain <= 0)
                        {
                            var processExe = _processExeRepository.GetSingleByCondition(x => x.ProcessExecutionId == item.ProcessExecutionId);
                            processExe.Status = 4;
                            _processExeRepository.Update(processExe);
                        }
                    }
                }
            }
            this.Save();
            data.PageData = ConvertData(listProcessExe);
            res.OnSuccess(data);
            return res;
        }
        private double GetDiffDayMinute(DateTime dayOne, DateTime dayTwo)
        {
            TimeSpan diffMs = dayTwo - dayOne; // milliseconds between now & Christmas
            return Math.Floor(diffMs.TotalMinutes);
        }
        public ServiceResponse RejectStep(DataInitProcessExe data, int currentUserID)
        {

            ServiceResponse res = new ServiceResponse();
            if (data == null)
            {
                res.OnError("Data empty");
                return res;
            }

            var stepExe = _stepExeRepository.GetSingleByCondition(x => x.NextAssigneeId == null
                          && x.CurrentAssigneeId == currentUserID && x.ProcessStepId == data.ProcessStepId && x.ProcessExecutionId == data.ProcessExeId);
            if (stepExe == null)
            {
                res.OnError("Some error happen");
                return res;
            }
            stepExe.IsReject = true;
            stepExe.RejectReason = data.RejectReason;

            _stepExeRepository.Update(stepExe);

            var processExe = _processExeRepository.GetSingleById(data.ProcessExeId);
            if (processExe != null)
            {
                processExe.Status = 3;
                _processExeRepository.Update(processExe);
            }

            this.Save();
            res.OnSuccess(processExe);
            return res;
        }
    }

}
