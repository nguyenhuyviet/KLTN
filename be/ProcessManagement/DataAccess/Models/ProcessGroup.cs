using System;
using System.Collections.Generic;

#nullable disable

namespace DataAccess.Models
{
    public partial class ProcessGroup
    {
        public ProcessGroup()
        {
            Processes = new HashSet<Process>();
        }

        public int ProcessGroupId { get; set; }
        public string ProcessGroupName { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual ICollection<Process> Processes { get; set; }
    }
}
