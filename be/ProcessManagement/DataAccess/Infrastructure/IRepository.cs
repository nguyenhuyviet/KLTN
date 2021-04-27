using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Infrastructure
{
    public interface IRepository<T> where T : class
    {
        T Add(T entity);
        List<T> AddMulti(List<T> entity);
        void Update(T entity);

        void AddOrUpdate(T entity);

        T Delete(T entity);
        void DeleteRange(List<T> lEntity);
        T Delete(int id);

        T GetSingleById(int id);

        T GetSingleByCondition(Expression<Func<T, bool>> expression, string[] includes = null);

        IEnumerable<T> GetAll(string[] includes = null);

        IEnumerable<T> GetMulti(Expression<Func<T, bool>> predicate, string[] includes = null);

        IEnumerable<T> GetMultiPaging(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50, string[] includes = null);
        bool CheckContains(Expression<Func<T, bool>> predicate);



        #region special

      //  ProcessStep GetDetailSingle(Expression<Func<ProcessStep, bool>> expression);
        #endregion

    }
}
