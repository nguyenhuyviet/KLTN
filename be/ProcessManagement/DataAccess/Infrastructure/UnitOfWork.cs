using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ProcessManagementDbContext _context;
        public UnitOfWork(ProcessManagementDbContext context)
        {
            _context = context;
        }
        public void Commit()
        {
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
