using BusinessAccess.Helpers;
using DataAccess.Enums;
using DataAccess.Infrastructure;
using DataAccess.Models;
using DataAccess.UtilModels;
using Microsoft.IdentityModel.Tokens;
using MoreLinq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BusinessAccess.Services
{
    public interface IUserService
    {
        ServiceResponse Add(UserLogin user, int currentUserID, string currentUsername);
        ServiceResponse Update(UserInfor user);
        ServiceResponse Delete(int id);
        ServiceResponse GetUserLoginById(int id);
        ServiceResponse GetMultiPagingInGroup(Paging paging, string[] includes = null);
        ServiceResponse GetMultiPaging(Paging paging, string[] includes = null);

        ServiceResponse GetAll();
        string GetToken(UserInfor userInfor);
        UserInfor GetUserInforLogin(UserLogin userLogin);
        ServiceResponse UpdatePassword(int currentUserID, string oldPw, string newPw);
        ServiceResponse UpdateFirstTimeLogin(int currentUserID);
        ServiceResponse AddMulti(List<UserLogin> user, int currentUserID, string currentUsername);
        ServiceResponse GetInStepSetting(Paging paging, string[] includes = null);

        ServiceResponse GetUserGroupInStepSetting(Paging paging, string[] includes = null);
        ServiceResponse GetMultiPagingGroup(Paging paging, string[] includes = null);
        ServiceResponse AddGroup(UserGroup user, int currentUserID, string currentUsername);
        ServiceResponse UpdateGroup(UserGroup user, int currentUserID, string currentUsername);
        ServiceResponse AddUserToGroup(List<UserGroupDetail> listUserGroupDetail, int currentUserID, string currentUsername);
        ServiceResponse GetGroupById(int groupId);
        ServiceResponse RemoveFromGroup(UserGroupDetail userGrpDetail);
        ServiceResponse DeleteGroup(int groupId);

        ServiceResponse GetPagingUserAddGroup(Paging paging, string[] includes = null);

        void Save();

    }
    public class UserService : IUserService
    {
        IRepository<UserInfor> _userRepository;
        IRepository<UserGroup> _userGrpRepository;
        IRepository<UserLogin> _userLoginRepository;
        IRepository<UserGroupDetail> _userGrpDetailRepository;
        IRepository<Role> _roleRepository;
        IUnitOfWork unitOfWork;

        public UserService(IRepository<UserInfor> user, IRepository<UserGroupDetail> userGrpDetailRepository, IRepository<UserGroup> userGrpRepository, IRepository<UserLogin> userLoginRepository, IRepository<Role> role, IUnitOfWork unitOfWork)
        {
            this._userRepository = user;
            this._userGrpRepository = userGrpRepository;
            this._roleRepository = role;
            this._userLoginRepository = userLoginRepository;
            this._userGrpDetailRepository = userGrpDetailRepository;
            this.unitOfWork = unitOfWork;
        }

        /// <summary>
        /// them mot
        /// </summary>
        /// <param name="user"></param>
        /// <param name="currentUserID"></param>
        /// <param name="currentUsername"></param>
        /// <returns></returns>
        public ServiceResponse Add(UserLogin user, int currentUserID, string currentUsername)
        {
            var now = DateTime.Now;
            ServiceResponse res = new ServiceResponse();
            if (user == null || (user != null && user.User == null) || (user != null && user.User != null && user.User.UserLogin == null))
            {
                res.OnError("Data empty");
                return res;
            }
            if (user.UserId != 0)
            {
                var userUpdate = _userRepository.GetSingleById(user.UserId);
                if (userUpdate != null)
                {
                    userUpdate.FullName = user.User.FullName;
                    userUpdate.Email = user.User.Email;
                    userUpdate.DateOfBirth = user.User.DateOfBirth;
                    userUpdate.Phone = user.User.Phone;
                    userUpdate.Address = user.User.Address;
                    userUpdate.RoleId = user.User.RoleId;

                    userUpdate.ModifiedBy = currentUsername;
                    userUpdate.ModifiedDate = now;
                    _userRepository.AddOrUpdate(userUpdate);
                    res.OnSuccess(userUpdate);
                    this.Save();
                }
                else
                {
                    res.OnError("Không tìm thấy tài khoản");
                }
            }
            else
            {

                if (!_userLoginRepository.CheckContains(x => x.Username == user.Username))
                {
                    user.User.CreatedBy = currentUsername;
                    user.User.CreatedDate = now;
                    user.User.ModifiedBy = currentUsername;
                    user.User.ModifiedDate = now;
                    var userInforAdd = _userRepository.Add(user.User);
                    this.Save();
                    res.OnSuccess(userInforAdd);

                }
                else
                {
                    res.OnError("Duplicate account");
                }
            }
            return res;
        }

        /// <summary>
        /// Them nhieu
        /// </summary>
        /// <param name="listUser"></param>
        /// <param name="currentUserID"></param>
        /// <param name="currentUsername"></param>
        /// <returns></returns>
        public ServiceResponse AddMulti(List<UserLogin> listUser, int currentUserID, string currentUsername)
        {
            ServiceResponse res = new ServiceResponse();
            var now = DateTime.Now;
            if (listUser == null || (listUser != null && listUser.Count == 0))
            {
                res.OnError("Data empty");
                return res;
            }

            //check duplicate data req
            //var duplicates = list.GroupBy(s => s.Id)
            //                 .Where(g => g.Count() > 1)
            //                 .SelectMany(g => g); // or .SelectMany(g => g)

            List<UserInfor> listFailed = new List<UserInfor>();
            List<UserInfor> listSuccess = new List<UserInfor>();

            listUser.ForEach(user =>
            {
                if (user == null || (user != null && user.User == null) || (user != null && user.User != null && user.User.UserLogin == null))
                {
                    listFailed.Add(user.User);
                }
                else if (_userLoginRepository.CheckContains(x => x.Username == user.Username))
                {
                    listFailed.Add(user.User);
                }
                else
                {
                    user.User.CreatedBy = currentUsername;
                    user.User.CreatedDate = now;
                    user.User.ModifiedBy = currentUsername;
                    user.User.ModifiedDate = now;
                    listSuccess.Add(user.User);
                }
            });

            if (listSuccess != null && listSuccess.Count > 0)
            {
                _userRepository.AddMulti(listSuccess);
                this.Save();
            }
            DataInsert data = new DataInsert()
            {
                DataFailed = listFailed,
                DataSuccess = listSuccess,
            };
            res.OnSuccess(data);
            return res;
        }

        public ServiceResponse Delete(int id)
        {
            ServiceResponse res = new ServiceResponse();
            var data = _userRepository.Delete(id);
            this.Save();
            res.OnSuccess(data);
            return res;
        }

        public ServiceResponse GetAll()
        {
            ServiceResponse res = new ServiceResponse();
            var listUser = _userRepository.GetAll();
            res.OnSuccess(listUser);

            return res;
        }

        public ServiceResponse GetUserLoginById(int id)
        {
            ServiceResponse result = new ServiceResponse();
            var userLogin = _userLoginRepository.GetSingleById(id);
            if (userLogin != null)
            {
                result.OnSuccess(userLogin);
            }
            else
            {
                result.Data = null;
            }
            return result;

        }
        public ServiceResponse Update(UserInfor user)
        {
            throw new NotImplementedException();
        }

        public string GetToken(UserInfor user)
        {
            //AppSettings _appSettings = new AppSettings();


            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("dNYZfjES8AiGKFHRrWYF");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.Name, user.UserLogin.Username),
                        new Claim(ClaimTypes.Role, user.Role.RoleName),
                        new Claim("UserID", user.UserId.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public UserInfor GetUserInforLogin(UserLogin userLogin)
        {
            var userInfor = new UserInfor();

            var user = _userLoginRepository.GetSingleByCondition(x => x.Username == userLogin.Username);
            if (user == null)
            {
                return null;
            }
            else
            {
                var passwordDecrypt = CommonUltils.DecryptStringAES(userLogin.Password);
                var validPw = CommonUltils.VerifyPasswordHash(passwordDecrypt, user.PasswordHash, user.PasswordSalt);
                if (validPw == false)
                {
                    return null;
                }
                else
                {

                    string[] includes = new string[1] { "Role" };
                    userInfor = _userRepository.GetSingleByCondition(x => x.UserId == user.UserId, includes);
                }
            }

            return userInfor;
        }
        public void Save()
        {

            unitOfWork.Commit();

        }

        public ServiceResponse UpdatePassword(int currentUserID, string oldPw, string newPw)
        {
            ServiceResponse result = new ServiceResponse();

            var userLogin = _userLoginRepository.GetSingleById(currentUserID);
            if (userLogin != null)
            {
                var oldPwDecrypt = CommonUltils.DecryptStringAES(oldPw);
                var newPwDecrypt = CommonUltils.DecryptStringAES(newPw);

                var validPw = CommonUltils.VerifyPasswordHash(oldPwDecrypt, userLogin.PasswordHash, userLogin.PasswordSalt);

                if (validPw)
                {
                    userLogin.Password = newPwDecrypt;
                    CommonUltils.CreatePasswordHash(newPwDecrypt, out byte[] passwordHash, out byte[] passwordSalt);
                    userLogin.PasswordHash = passwordHash;
                    userLogin.PasswordSalt = passwordSalt;
                    userLogin.IsFirstTimeLogin = 1;
                    _userLoginRepository.Update(userLogin);

                    this.Save();
                    result.OnSuccess(null);
                }
                else
                {
                    result.OnError("Old password incorrect", 10);
                }
            }
            else
            {
                result.OnError("Cannot find User", 11);
            }

            return result;

        }

        public ServiceResponse UpdateFirstTimeLogin(int currentUserID)
        {
            ServiceResponse result = new ServiceResponse();

            var userLogin = _userLoginRepository.GetSingleById(currentUserID);
            if (userLogin != null)
            {

                userLogin.IsFirstTimeLogin = 0;
                _userLoginRepository.Update(userLogin);

                this.Save();
                result.OnSuccess(null);

            }
            else
            {
                result.OnError("Cannot find User", 11);
            }

            return result;

        }

        public ServiceResponse GetInStepSetting(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserInfor> query = null;
            PagingResult data = new PagingResult();

            if (!String.IsNullOrEmpty(paging.FilterString))
            {
                query = _userRepository.GetMulti(x => x.FullName.ToUpper().Contains(paging.FilterString.ToUpper()) ||
                    x.Email.ToUpper().Contains(paging.FilterString.ToUpper()), includes);


                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {
                query = _userRepository.GetAll(includes);
            }
            query = query.OrderBy(x => x.FullName);

            data.TotalRecord = query.Count();
            data.PageData = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize);
            res.OnSuccess(data);
            return res;

        }

        public ServiceResponse GetUserGroupInStepSetting(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserGroup> query = null;
            PagingResult data = new PagingResult();

            if (!String.IsNullOrEmpty(paging.FilterString))
            {
                query = _userGrpRepository.GetMulti(x => x.UserGroupName.ToUpper().Contains(paging.FilterString.ToUpper()), includes);


                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {
                query = _userGrpRepository.GetAll(includes);
            }
            query = query.OrderBy(x => x.UserGroupName);

            data.TotalRecord = query.Count();
            data.PageData = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize);
            res.OnSuccess(data);
            return res;

        }


        public ServiceResponse GetMultiPagingGroup(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserGroup> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }



            if (!String.IsNullOrEmpty(paging.FilterString))
            {
                // 
                query = _userGrpRepository.GetMulti(x => x.UserGroupName.ToUpper().Contains(paging.FilterString.ToUpper())
                || x.Description.ToUpper().Contains(paging.FilterString.ToUpper()), includes);

                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {

                query = _userGrpRepository.GetAll(includes);


            }

            if (!String.IsNullOrEmpty(paging.SortBy))
            {
                var propertyInfo = typeof(UserGroup).GetProperty(paging.SortBy);
                if (paging.Sort != null && (paging.Sort.ToUpper().Equals("DESC") || paging.Sort.Equals(null)))
                {
                    query = query.OrderByDescending(x => propertyInfo.GetValue(x, null));
                }
                else
                {

                    query = query.OrderBy(x => propertyInfo.GetValue(x, null));
                }
            }
            data.TotalRecord = query.Count();
            data.PageData = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize);
            res.OnSuccess(data);
            return res;

        }

        public ServiceResponse AddGroup(UserGroup user, int currentUserID, string currentUsername)
        {
            ServiceResponse res = new ServiceResponse();
            if (user == null || (user != null && user.UserGroupName == null))
            {
                res.OnError("Data empty");
                return res;
            }

            if (!_userGrpRepository.CheckContains(x => x.UserGroupName == user.UserGroupName))
            {

                DateTime now = DateTime.Now;

                user.CreatedBy = currentUsername;
                user.CreatedDate = now;
                user.ModifiedBy = currentUsername;
                user.ModifiedDate = now;

                var userGrpAdd = _userGrpRepository.Add(user);
                res.OnSuccess(userGrpAdd);

                this.Save();

            }
            else
            {
                res.OnError("Duplicate group");
            }
            return res;
        }

        public ServiceResponse UpdateGroup(UserGroup user, int currentUserID, string currentUsername)
        {
            ServiceResponse res = new ServiceResponse();
            if (user == null || (user != null && user.UserGroupName == null))
            {
                res.OnError("Data empty");
                return res;
            }
            var userGrp = _userGrpRepository.GetSingleById(user.UserGroupId);
            if (userGrp == null)
            {

                res.OnError("Group not exist");
                return res;
            }

            if (!_userGrpRepository.CheckContains(x => x.UserGroupName == user.UserGroupName))
            {

                DateTime now = DateTime.Now;

                userGrp.UserGroupName = user.UserGroupName;
                userGrp.ModifiedBy = currentUsername;
                userGrp.ModifiedDate = now;

                _userGrpRepository.Update(userGrp);
                res.OnSuccess(userGrp);
                this.Save();

            }
            else
            {
                res.OnError("Duplicate group");
            }
            return res;
        }

        public ServiceResponse GetMultiPagingInGroup(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserGroupDetail> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }

            var userGrpId = 0;
            if (paging.ExtraCondition != null)
            {
                userGrpId = paging.ExtraCondition.UserGroupId;
            }

            includes = new string[1] { "User" };


            if (!String.IsNullOrEmpty(paging.FilterString))
            {


                query = _userGrpDetailRepository.GetMulti(x => x.UserGroupId == userGrpId
                && x.User.FullName.ToUpper().Contains(paging.FilterString.ToUpper())
                || x.User.Email.ToUpper().Contains(paging.FilterString.ToUpper()), includes);

                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {
                query = _userGrpDetailRepository.GetMulti(x => x.UserGroupId == userGrpId, includes);
                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }

            var query1 = query.Select(x => x.User);

            if (!String.IsNullOrEmpty(paging.SortBy))
            {
                var propertyInfo = typeof(UserInfor).GetProperty(paging.SortBy);
                if (paging.Sort != null && (paging.Sort.ToUpper().Equals("DESC") || paging.Sort.Equals(null)))
                {
                    query1 = query1.OrderByDescending(x => propertyInfo.GetValue(x, null));
                }
                else
                {

                    query1 = query1.OrderBy(x => propertyInfo.GetValue(x, null));
                }
            }
            data.TotalRecord = query1.Count();
            var listResult = query1.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize).ToList();
            if (listResult != null)
            {
                foreach (var item in listResult)
                {


                    item.UserGroupDetails = null;

                }
            }
            data.PageData = listResult;
            res.OnSuccess(data);
            return res;
        }


        #region group

        public ServiceResponse GetGroupById(int groupId)
        {
            ServiceResponse res = new ServiceResponse();

            var data = _userGrpRepository.GetSingleById(groupId);

            if (data != null)
            {
                res.OnSuccess(data);
            }
            else
            {
                res.OnError("Không có dữ liệu");
            }
            return res;
        }

        public ServiceResponse DeleteGroup(int groupId)
        {
            ServiceResponse res = new ServiceResponse();
            if (groupId == null || groupId == 0)
            {
                res.OnError("Data empty");
                return res;
            }


            var data = _userGrpRepository.Delete(groupId);
            this.Save();
            res.OnSuccess(data);

            return res;
        }

        public ServiceResponse GetPagingUserAddGroup(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserGroupDetail> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }



            var userGroupId = 0;
            if (paging.ExtraCondition != null)
            {
                userGroupId = paging.ExtraCondition.UserGroupId;
            }

            includes = new string[1] { "User" };

            if (!String.IsNullOrEmpty(paging.FilterString))
            {
                var listUsr = _userGrpDetailRepository.GetMulti(x => x.UserGroupId == userGroupId, includes);
                var listUsrId = listUsr.Select(x => x.User.UserId);

                query = _userGrpDetailRepository.GetMulti(x => x.UserGroupId != userGroupId &&
                (listUsrId != null && !listUsrId.Contains(x.User.UserId) || listUsrId == null)
                && x.User.FullName.ToUpper().Contains(paging.FilterString.ToUpper())
                || x.User.Email.ToUpper().Contains(paging.FilterString.ToUpper()), includes);


                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {
                var listUsr = _userGrpDetailRepository.GetMulti(x => x.UserGroupId == userGroupId, includes);
                var listUsrId = listUsr.Select(x => x.User.UserId);

                query = _userGrpDetailRepository.GetMulti(x => x.UserGroupId != userGroupId
                && (listUsrId != null && !listUsrId.Contains(x.User.UserId) || listUsrId == null), includes);
                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }

            var query1 = query.Select(x => x.User).DistinctBy(x => x.UserId);

            data.TotalRecord = query1.Count();

            var listResult = query1.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize).ToList();
            if (listResult != null)
            {
                foreach (var item in listResult)
                {
                    item.UserGroupDetails = null;

                }
            }
            data.PageData = listResult;
            res.OnSuccess(data);
            return res;
        }

        public ServiceResponse AddUserToGroup(List<UserGroupDetail> listUserGroupDetail, int currentUserID, string currentUsername)
        {
            ServiceResponse res = new ServiceResponse();
            if (listUserGroupDetail == null || (listUserGroupDetail != null && listUserGroupDetail.Count == 0))
            {
                res.OnError("Data empty");
                return res;
            }
            var userGrp = _userGrpRepository.GetSingleById((int)listUserGroupDetail.First().UserGroupId);
            if (userGrp == null)
            {

                res.OnError("Group does not exist");
                return res;
            }

            _userGrpDetailRepository.AddMulti(listUserGroupDetail);
            res.OnSuccess(listUserGroupDetail);
            this.Save();
            return res;
        }

        public ServiceResponse RemoveFromGroup(UserGroupDetail userGrpDetail)
        {
            ServiceResponse res = new ServiceResponse();

            var userGrp = _userGrpRepository.GetSingleById((int)userGrpDetail.UserGroupId);

            if (userGrp == null)
            {
                res.OnError("Group does not exist");
                return res;

            }

            var user = _userRepository.GetSingleById((int)userGrpDetail.UserId);

            if (user == null)
            {
                res.OnError("User does not exist");
                return res;

            }

            var userGroupDetail = _userGrpDetailRepository.GetSingleByCondition(x => x.UserGroupId == userGrp.UserGroupId && x.UserId == user.UserId);
            if (userGroupDetail == null)
            {
                res.OnError("Group or User does not exist");
                return res;

            }
            _userGrpDetailRepository.Delete(userGroupDetail.Id);
            res.OnSuccess(userGroupDetail);
            this.Save();
            return res;
        }

        public ServiceResponse GetMultiPaging(Paging paging, string[] includes = null)
        {
            ServiceResponse res = new ServiceResponse();
            IEnumerable<UserInfor> query = null;
            PagingResult data = new PagingResult();

            if (paging == null)
            {
                res.OnError("Data truyền lên rỗng");
                return res;
            }

            includes = new string[2] { "Role", "UserGroupDetails.UserGroup" };


            if (!String.IsNullOrEmpty(paging.FilterString))
            {


                query = _userRepository.GetMulti(x => x.FullName.ToUpper().Contains(paging.FilterString.ToUpper())
                || x.Email.ToUpper().Contains(paging.FilterString.ToUpper()), includes);

                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }
            else
            {
                query = _userRepository.GetAll(includes);
                if (query == null)
                {
                    res.OnSuccess(data);
                    return res;
                }
            }



            if (!String.IsNullOrEmpty(paging.SortBy))
            {
                var propertyInfo = typeof(UserInfor).GetProperty(paging.SortBy);
                if (paging.Sort != null && (paging.Sort.ToUpper().Equals("DESC") || paging.Sort.Equals(null)))
                {
                    query = query.OrderByDescending(x => propertyInfo.GetValue(x, null));
                }
                else
                {

                    query = query.OrderBy(x => propertyInfo.GetValue(x, null));
                }
            }
            data.TotalRecord = query.Count();
            var listResult = query.Skip((paging.CurrentPage - 1) * paging.PageSize).Take(paging.PageSize).ToList();
            if (listResult != null)
            {
                foreach (var item in listResult)
                {

                    if (item.Role != null)
                    {
                        item.Role.UserInfors = null;
                    }
                    if (item.UserGroupDetails != null)
                    {
                        foreach (var groupDetail in item.UserGroupDetails)
                        {
                            if (groupDetail.UserGroup != null)
                            {

                                groupDetail.UserGroup.UserGroupDetails = null;
                            }
                        }
                    }
                }
            }
            data.PageData = listResult;
            res.OnSuccess(data);
            return res;
        }

        #endregion
    }
}
