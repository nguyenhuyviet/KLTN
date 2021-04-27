using DataAccess.Enums;
using DataAccess.Infrastructure;
using DataAccess.Models;
using DataAccess.UtilModels;
using Microsoft.IdentityModel.Tokens;
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
        ServiceResponse GetAll();
        string GetToken(UserInfor userInfor);
        UserInfor GetUserInforLogin(UserLogin userLogin);
        ServiceResponse UpdatePassword(int currentUserID, string oldPw, string newPw);
        ServiceResponse AddMulti(List<UserLogin> user, int currentUserID, string currentUsername);
        ServiceResponse GetInStepSetting(Paging paging, string[] includes = null);

        ServiceResponse GetUserGroupInStepSetting(Paging paging, string[] includes = null);
        void Save();

    }
    public class UserService : IUserService
    {
        IRepository<UserInfor> _userRepository;
        IRepository<UserGroup> _userGrpRepository;
        IRepository<UserLogin> _userLoginRepository;
        IRepository<Role> _roleRepository;
        IUnitOfWork unitOfWork;

        public UserService(IRepository<UserInfor> user, IRepository<UserGroup> userGrpRepository, IRepository<UserLogin> userLoginRepository, IRepository<Role> role, IUnitOfWork unitOfWork)
        {
            this._userRepository = user;
            this._userGrpRepository = userGrpRepository;
            this._roleRepository = role;
            this._userLoginRepository = userLoginRepository;
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
            ServiceResponse res = new ServiceResponse();
            if (user == null || (user != null && user.User == null) || (user != null && user.User != null && user.User.Role == null))
            {
                res.OnError("Data empty");
                return res;
            }

            if (!_userLoginRepository.CheckContains(x => x.Username == user.Username))
            {

                var userInforAdd = _userRepository.Add(user.User);
                this.Save();

            }
            else
            {
                res.OnError("Duplicate account");
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
                if (user == null || (user != null && user.User == null) || (user != null && user.User != null && user.User.Role == null))
                {
                    listFailed.Add(user.User);
                }
                else if (_userLoginRepository.CheckContains(x => x.Username == user.Username))
                {
                    listFailed.Add(user.User);
                }
                else
                {
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
            throw new NotImplementedException();
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

            var user = _userLoginRepository.GetSingleByCondition(x => x.Username == userLogin.Username && x.Password == userLogin.Password);
            if (user == null)
            {
                return null;
            }
            else
            {
                string[] includes = new string[1] { "Role" };
                userInfor = _userRepository.GetSingleByCondition(x => x.UserId == user.UserId, includes);
            }

            return userInfor;
        }
        public void Save()
        {

            unitOfWork.Commit();

        }
        // private helper methods

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        public ServiceResponse UpdatePassword(int currentUserID, string oldPw, string newPw)
        {
            ServiceResponse result = new ServiceResponse();
            var userLogin = _userLoginRepository.GetSingleById(currentUserID);
            if (userLogin != null)
            {
                if (userLogin.Password.Equals(oldPw))
                {
                    userLogin.Password = newPw;
                    _userLoginRepository.Update(userLogin);
                    this.Save();
                    result.OnSuccess(null);
                }
                else
                {
                    result.OnError("Old password incorrect", (int)ResponseCode.SomeError);
                }
            }
            else
            {
                result.OnError("Cannot find User", (int)ResponseCode.SomeError);
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

       
    }
}
