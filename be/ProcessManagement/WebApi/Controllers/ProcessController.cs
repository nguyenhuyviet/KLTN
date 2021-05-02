using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessAccess.Helpers;
using BusinessAccess.Services;
using DataAccess.Models;
using DataAccess.UtilModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessController : ControllerBase
    {
        IProcessService _processService;
        IProcessExecutionService _processExeService;
        public ProcessController(IProcessService processService, IProcessExecutionService processExeService)
        {
            this._processService = processService;
            this._processExeService = processExeService;
        }

        #region process

        [HttpGet("GetAll")]
        public ServiceResponse GetAll()
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetAll();

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpGet("GetMulti")]
        public ServiceResponse GetMulti()
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetMulti(x => x.ProcessImage == null || x.ProcessImage == "");

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpPost("GetMultiPaging")]
        public ServiceResponse GetMultiPaging(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                string[] includes = new string[1] { "ProcessGroup" };
                result = _processService.GetMultiPaging(paging, includes);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpPost("AddProcess")]
        public ServiceResponse AddProcess(Process process)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.Add(process, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("UpdateProcess")]
        public ServiceResponse UpdateProcess(Process process)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.Update(process, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

       

        #endregion
        #region step

        [HttpGet("GetAllStepByProcessID/{processID}")]
        public ServiceResponse GetAllStepByProcessID(int processID)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetAllStepByProcessID(processID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpGet("GetStepByID/{processID}/{processStepID}")]
        public ServiceResponse GetStepByID(int processID, int processStepID)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetStepByID(processID, processStepID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpGet("GetFirstStep/{processID}")]
        public ServiceResponse GetFirstStep(int processID)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetFirstStep(processID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpGet("GetStepById/{processStepID}")]
        public ServiceResponse GetStepById(int processStepID)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetStepById(processStepID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        

       [HttpPost("GetListAssignee")]
        public ServiceResponse GetListAssignee(ProcessStep processStep)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetListAssignee(processStep);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpPost("AddStep")]
        public ServiceResponse AddStep(ProcessStep processStep)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.AddStep(processStep, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("UpdateStep")]
        public ServiceResponse UpdateStep(ProcessStep processStep)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.UpdateStep(processStep, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        [HttpGet("DeleteStep/{stepId}")]
        public ServiceResponse DeleteStep(int stepId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.DeleteStep(stepId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        #endregion


        #region execution

        [HttpPost("InitProcessExe")]
        public ServiceResponse InitProcessExe(DataInitProcessExe data)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _processExeService.InitProcessExe(data, currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("NextStep")]
        public ServiceResponse NextStep(DataInitProcessExe data)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _processExeService.NextStep(data, currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        [HttpPost("GetProcessRelated")]
        public ServiceResponse GetProcessRelated(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _processExeService.GetProcessRelated(paging, currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        [HttpPost("GetNeedMyApproval")]
        public ServiceResponse GetProcessNeedMyApproval(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _processExeService.GetProcessNeedMyApproval(paging, currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        

       [HttpGet("GetStepExecution/{processExeId}")]
        public ServiceResponse GetStepExecution(int processExeId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _processExeService.GetStepExecution(processExeId, currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }


        #endregion

        #region group

        [HttpGet("getAllProcessGroup")]
        public ServiceResponse GetAllProcessGroup()
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _processService.GetAllProcessGroup();

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }


        [HttpPost("GetMultiPagingGroup")]
        public ServiceResponse GetMultiPagingGroup(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
           
                result = _processService.GetMultiPagingGroup(paging);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

  
        [HttpPost("AddGroup")]
        public ServiceResponse AddGroup(ProcessGroup processGroup)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.AddGroup(processGroup, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("UpdateGroup")]
        public ServiceResponse UpdateGroup(ProcessGroup processGroup)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.UpdateGroup(processGroup, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        } 
        
        [HttpPost("AddProcessToGroup")]
        public ServiceResponse AddProcessToGroup(ProcessGroup processGroup)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.AddProcessToGroup(processGroup, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        } 
        
        [HttpGet("RemoveFromGroup/{processId}")]
        public ServiceResponse RemoveFromGroup(int processId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {

                result = _processService.RemoveFromGroup(processId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }
        
        [HttpGet("GetGroupById/{processGroupId}")]
        public ServiceResponse GetGroupById(int processGroupId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.GetGroupById(processGroupId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        } 
        
        [HttpGet("DeleteGroup/{processGroupId}")]
        public ServiceResponse DeleteGroup(int processGroupId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _processService.DeleteGroup(processGroupId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("GetPagingProcessAddGroup")]
        public ServiceResponse GetPagingProcessAddGroup(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                string[] includes = new string[1] { "ProcessGroup" };
                result = _processService.GetPagingProcessAddGroup(paging, includes);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        
        #endregion group
    }
}
