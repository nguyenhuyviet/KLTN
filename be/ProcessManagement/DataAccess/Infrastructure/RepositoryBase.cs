using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;

namespace DataAccess.Infrastructure
{
    public class RepositoryBase<T> : IRepository<T>, IDisposable where T : class
    {

        private ProcessManagementDbContext dataContext;
        private readonly DbSet<T> dbSet;

        public ProcessManagementDbContext DataContext { get { return this.dataContext ?? new ProcessManagementDbContext(); } }

        public RepositoryBase(ProcessManagementDbContext context)
        {
            this.dataContext = context;
            dbSet = context.Set<T>();
        }

        public void Dispose()
        {
            if (dataContext != null)
            {
                dataContext.Dispose();
            }
        }


        public T Add(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            dataContext.Add(entity);

            return entity;
        }

        public List<T> AddMulti(List<T> entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            dataContext.AddRange(entity);

            return entity;
        }

        public void Update(T entity)
        {
            dbSet.Attach(entity);
            dataContext.Entry(entity).State = EntityState.Modified;

        }

        public T Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            dataContext.Remove(entity);

            return entity;
        }

        public void DeleteRange(List<T> entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            dataContext.RemoveRange(entity);

        }

        public T Delete(int id)
        {
            var entity = dbSet.Find(id);
            if (entity != null)
            {
                dbSet.Remove(entity);

                return entity;
            }
            return null;
        }
      

        public void AddOrUpdate(T entity)
        {
            dbSet.Update(entity);
        }


        public T GetSingleById(int id)
        {
            return dbSet.Find(id);
        }

        public IEnumerable<T> GetAll(string[] includes = null)
        {
            //HANDLE INCLUDES FOR ASSOCIATED OBJECTS IF APPLICABLE
            if (includes != null && includes.Count() > 0)
            {
                var query = dataContext.Set<T>().Include(includes.First());
                foreach (var include in includes.Skip(1))
                    query = query.Include(include);
                return query.AsQueryable();
            }

            return dataContext.Set<T>().AsQueryable();
        }

        public T GetSingleByCondition(Expression<Func<T, bool>> expression, string[] includes = null)
        {
            if (includes != null && includes.Count() > 0)
            {
                var query = dataContext.Set<T>().Include(includes.First());
                foreach (var include in includes.Skip(1))
                    query = query.Include(include);
                return query.FirstOrDefault(expression);
            }
            return dataContext.Set<T>().FirstOrDefault(expression);
        }
        public virtual IEnumerable<T> GetMulti(Expression<Func<T, bool>> predicate, string[] includes = null)
        {
            //HANDLE INCLUDES FOR ASSOCIATED OBJECTS IF APPLICABLE
            if (includes != null && includes.Count() > 0)
            {
                var query = dataContext.Set<T>().Include(includes.First());
                foreach (var include in includes.Skip(1))
                    query = query.Include(include);
                return query.Where<T>(predicate).AsQueryable<T>();
            }

            return dataContext.Set<T>().Where<T>(predicate).AsQueryable<T>();
        }

        public virtual IEnumerable<T> GetMultiPaging(Expression<Func<T, bool>> predicate, out int total, int index = 0, int size = 20, string[] includes = null)
        {
            int skipCount = index * size;
            IQueryable<T> _resetSet;

            //HANDLE INCLUDES FOR ASSOCIATED OBJECTS IF APPLICABLE
            if (includes != null && includes.Count() > 0)
            {
                var query = dataContext.Set<T>().Include(includes.First());
                foreach (var include in includes.Skip(1))
                    query = query.Include(include);
                _resetSet = predicate != null ? query.Where<T>(predicate).AsQueryable() : query.AsQueryable();
            }
            else
            {
                _resetSet = predicate != null ? dataContext.Set<T>().Where<T>(predicate).AsQueryable() : dataContext.Set<T>().AsQueryable();
            }

            _resetSet = skipCount == 0 ? _resetSet.Take(size) : _resetSet.Skip(skipCount).Take(size);
            total = _resetSet.Count();
            return _resetSet.AsQueryable();
        }

        public bool CheckContains(Expression<Func<T, bool>> predicate)
        {
            return dataContext.Set<T>().Count<T>(predicate) > 0;
        }

        //public ProcessStep GetDetailSingle(Expression<Func<ProcessStep, bool>> expression)
        //{
        //    var data = dataContext.Set<ProcessStep>().Include(x => x.StepFields)
        //        .Include(x => x.StepTasks)
        //        .Include(x => x.StepAssignees.Select(c => c.User)).Where(expression).FirstOrDefault();
        //    return data;
        //}
    }
}
