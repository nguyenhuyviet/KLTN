using System;
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

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public ServiceResponse Authenticate(UserLogin userLogin)
        {
            ServiceResponse result = new ServiceResponse();

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

    }
}
