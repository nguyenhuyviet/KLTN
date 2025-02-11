﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessAccess.Helpers;
using BusinessAccess.Services;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.UtilModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        IUserService _userService;
        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        [Authorize]
        [HttpGet("GetAllUser")]
        public ServiceResponse GetAllUser()
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _userService.GetAll();

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
                // string[] includes = new string[1] { "" };
                result = _userService.GetMultiPaging(paging);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public ServiceResponse Authenticate(UserLogin userLogin)
        {
            ServiceResponse result = new ServiceResponse();

            try
            {

                var userInfor = _userService.GetUserInforLogin(userLogin);

                if (userInfor == null)
                {
                    result.OnError("Tài khoản hoặc mật khẩu không đúng", (int)ResponseCode.AuthenFail);
                }
                else if (userInfor.Role == null || userInfor.UserLogin == null)
                {
                    result.OnError("Đã có lỗi xảy ra", (int)ResponseCode.AuthenFail);
                }
                else
                {
                    var token = _userService.GetToken(userInfor);

                    var authenResult = new AuthenModel(userInfor, token);


                    result.OnSuccess(authenResult);
                }


            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }
            return result;
        }


        [Authorize]
        [HttpPost("UpdatePassword")]
        public ServiceResponse UpdatePassword(UserChangePassword userLogin)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _userService.UpdatePassword(currentUserID, userLogin.OldPassword, userLogin.NewPassword);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [Authorize]
        [HttpGet("UpdateFirstTimeLogin")]
        public ServiceResponse UpdateFirstTimeLogin()
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                result = _userService.UpdateFirstTimeLogin(currentUserID);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [Authorize]
        [HttpPost("AddUser")]
        public ServiceResponse AddUser(UserLogin userLogin)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.Add(userLogin, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [Authorize]
        [HttpGet("DeleteUser/{userId}")]
        public ServiceResponse DeleteUser(int userId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.Delete(userId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        [Authorize]
        [HttpPost("AddMultiUser")]
        public ServiceResponse AddMultiUser(List<UserLogin> listUserLogin)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.AddMulti(listUserLogin, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("GetInStepSetting")]
        public ServiceResponse GetInStepSetting(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                result = _userService.GetInStepSetting(paging);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpPost("GetGroupInStepSetting")]
        public ServiceResponse GetGroupInStepSetting(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                // string[] includes = new string[1] { "" };
                result = _userService.GetUserGroupInStepSetting(paging);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        #region group

        [HttpPost("GetMultiPagingGroup")]
        public ServiceResponse GetMultiPagingGroup(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                // string[] includes = new string[1] { "" };
                result = _userService.GetMultiPagingGroup(paging);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }


        [HttpPost("AddGroup")]
        public ServiceResponse AddGroup(UserGroup userGrp)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.AddGroup(userGrp, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        [HttpPost("UpdateGroup")]
        public ServiceResponse UpdateGroup(UserGroup userGrp)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.UpdateGroup(userGrp, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }


        [HttpPost("AddUserToGroup")]
        public ServiceResponse AddUserToGroup(List<UserGroupDetail> listUserGroupDetail)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.AddUserToGroup(listUserGroupDetail, currentUserID, currentUsername);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("RemoveFromGroup")]
        public ServiceResponse RemoveFromGroup(UserGroupDetail userGrpDetail)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {

                result = _userService.RemoveFromGroup(userGrpDetail);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpGet("GetGroupById/{userGroupId}")]
        public ServiceResponse GetGroupById(int userGroupId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.GetGroupById(userGroupId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpGet("DeleteGroup/{userGroupId}")]
        public ServiceResponse DeleteGroup(int userGroupId)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                var currentUserID = GetCurrentUser.GetUserID(User.Claims.ToList());
                var currentUsername = User.Identity.Name;
                result = _userService.DeleteGroup(userGroupId);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }


            return result;
        }

        [HttpPost("GetPagingUserAddGroup")]
        public ServiceResponse GetPagingUserAddGroup(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                string[] includes = new string[1] { "ProcessGroup" };
                result = _userService.GetPagingUserAddGroup(paging, includes);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }

        [HttpPost("GetMultiPagingInGroup")]
        public ServiceResponse GetMultiPagingInGroup(Paging paging)
        {
            ServiceResponse result = new ServiceResponse();
            try
            {
                string[] includes = new string[1] { "ProcessGroup" };
                result = _userService.GetMultiPagingInGroup(paging, includes);

            }
            catch (Exception ex)
            {
                result.OnExeption(ex);
            }

            return result;
        }
        #endregion
    }
}
