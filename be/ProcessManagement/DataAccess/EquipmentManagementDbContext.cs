using System;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace DataAccess
{
    public partial class ProcessManagementDbContext : DbContext
    {
        public ProcessManagementDbContext()
        {
        }

        public ProcessManagementDbContext(DbContextOptions<ProcessManagementDbContext> options)
            : base(options)
        {
        }


        public virtual DbSet<AssigneeUser> AssigneeUsers { get; set; }
        public virtual DbSet<Process> Processes { get; set; }
        public virtual DbSet<ProcessExecution> ProcessExecutions { get; set; }
        public virtual DbSet<ProcessGroup> ProcessGroups { get; set; }
        public virtual DbSet<ProcessStep> ProcessSteps { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<StepAssignee> StepAssignees { get; set; }
        public virtual DbSet<StepExecution> StepExecutions { get; set; }
        public virtual DbSet<StepField> StepFields { get; set; }
        public virtual DbSet<StepTask> StepTasks { get; set; }
        public virtual DbSet<UserGroup> UserGroups { get; set; }
        public virtual DbSet<UserGroupDetail> UserGroupDetails { get; set; }
        public virtual DbSet<UserInfor> UserInfors { get; set; }
        public virtual DbSet<UserLogin> UserLogins { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=12345678;database=process_management", Microsoft.EntityFrameworkCore.ServerVersion.FromString("10.3.23-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AssigneeUser>(entity =>
            {
                entity.HasKey(e => e.AssingeeUserId)
                    .HasName("PRIMARY");

                entity.ToTable("assignee_user");

                entity.Property(e => e.AssingeeUserId)
                    .HasColumnType("int(11)")
                    .HasColumnName("AssingeeUserID");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ProcessStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessStepID");

                entity.Property(e => e.UserId)
                    .HasColumnType("varchar(255)")
                    .HasColumnName("UserID")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");
            });

            modelBuilder.Entity<Process>(entity =>
            {
                entity.ToTable("process");

                entity.HasIndex(e => e.ProcessGroupId, "FK_process_process_group_ProcessGroupID");

                entity.Property(e => e.ProcessId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessID");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasColumnType("text")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ProcessGroupId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessGroupID");

                entity.Property(e => e.ProcessImage)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ProcessName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ProcessStatus).HasColumnType("int(11)");

                entity.HasOne(d => d.ProcessGroup)
                    .WithMany(p => p.Processes)
                    .HasForeignKey(d => d.ProcessGroupId);
            });

            modelBuilder.Entity<ProcessExecution>(entity =>
            {
                entity.ToTable("process_execution");

                entity.HasIndex(e => e.ProcessSettingId, "FK_process_execution_process_ProcessID");

                entity.HasIndex(e => e.CurrentStepId, "FK_process_execution_process_step_ProcessStepID");

                entity.HasIndex(e => e.OwnerId, "FK_process_execution_user_infor_UserID");

                entity.Property(e => e.ProcessExecutionId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessExecutionID");

                entity.Property(e => e.CompletedDate).HasColumnType("datetime");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CurrentStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("CurrentStepID");

                entity.Property(e => e.OwnerId)
                    .HasColumnType("int(11)")
                    .HasColumnName("OwnerID");

                entity.Property(e => e.Priority).HasColumnType("int(11)");

                entity.Property(e => e.ProcessExecutionName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ProcessSettingId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessSettingID");

                entity.Property(e => e.Status).HasColumnType("int(11)");

                entity.HasOne(d => d.CurrentStep)
                    .WithMany(p => p.ProcessExecutions)
                    .HasForeignKey(d => d.CurrentStepId)
                    .HasConstraintName("FK_process_execution_process_step_ProcessStepID");

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.ProcessExecutions)
                    .HasForeignKey(d => d.OwnerId)
                    .HasConstraintName("FK_process_execution_user_infor_UserID");

                entity.HasOne(d => d.ProcessSetting)
                    .WithMany(p => p.ProcessExecutions)
                    .HasForeignKey(d => d.ProcessSettingId)
                    .HasConstraintName("FK_process_execution_process_ProcessID");
            });

            modelBuilder.Entity<ProcessGroup>(entity =>
            {
                entity.ToTable("process_group");

                entity.Property(e => e.ProcessGroupId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessGroupID");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ProcessGroupName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");
            });

            modelBuilder.Entity<ProcessStep>(entity =>
            {
                entity.ToTable("process_step");

                entity.HasIndex(e => e.ProcessId, "FK_process_step_process_ProcessID");

                entity.Property(e => e.ProcessStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessStepID");

                entity.Property(e => e.AssigneeType).HasColumnType("int(11)");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeadLine).HasColumnType("int(11)");

                entity.Property(e => e.Description)
                    .HasColumnType("text")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ProcessId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessID");

                entity.Property(e => e.ProcessStepName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.SortOrder).HasColumnType("int(11)");

                entity.Property(e => e.StepSortOrder)
                    .HasColumnType("int(11)")
                    .HasComment(" = 1 là step đầu, = 2 là step cuối , còn lại step giữa");

                entity.HasOne(d => d.Process)
                    .WithMany(p => p.ProcessSteps)
                    .HasForeignKey(d => d.ProcessId);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.Property(e => e.RoleId)
                    .HasColumnType("int(11)")
                    .HasColumnName("RoleID");

                entity.Property(e => e.RoleName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");
            });

            modelBuilder.Entity<StepAssignee>(entity =>
            {
                entity.HasKey(e => e.StepAssingeeId)
                    .HasName("PRIMARY");

                entity.ToTable("step_assignee");

                entity.HasIndex(e => e.ProcessStepId, "FK_step_assignee_process_step_ProcessStepID");

                entity.HasIndex(e => e.UserGroupId, "FK_step_assignee_user_group_UserGroupID");

                entity.HasIndex(e => e.UserId, "FK_step_assignee_user_infor_UserID");

                entity.Property(e => e.StepAssingeeId)
                    .HasColumnType("int(11)")
                    .HasColumnName("StepAssingeeID");

                entity.Property(e => e.ProcessStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessStepID");

                entity.Property(e => e.UserGroupId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserGroupID");

                entity.Property(e => e.UserId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserID");

                entity.HasOne(d => d.ProcessStep)
                    .WithMany(p => p.StepAssignees)
                    .HasForeignKey(d => d.ProcessStepId);

                entity.HasOne(d => d.UserGroup)
                    .WithMany(p => p.StepAssignees)
                    .HasForeignKey(d => d.UserGroupId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.StepAssignees)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<StepExecution>(entity =>
            {
                entity.ToTable("step_execution");

                entity.HasIndex(e => e.NextAssigneeId, "FK_next_step_execution_user_infor_UserID");

                entity.HasIndex(e => e.PrevAssigneeId, "FK_prev_step_execution_user_infor_UserID");

                entity.HasIndex(e => e.ProcessExecutionId, "FK_step_execution_process_execution_ProcessExecutionID");

                entity.HasIndex(e => e.ProcessStepId, "FK_step_execution_process_step_ProcessStepID");

                entity.HasIndex(e => e.CurrentAssigneeId, "FK_step_execution_user_infor_UserID");

                entity.Property(e => e.StepExecutionId)
                    .HasColumnType("int(11)")
                    .HasColumnName("StepExecutionID");

                entity.Property(e => e.CompletedDate).HasColumnType("datetime");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CurrentAssigneeId)
                    .HasColumnType("int(11)")
                    .HasColumnName("CurrentAssigneeID");

                entity.Property(e => e.NextAssigneeId)
                    .HasColumnType("int(11)")
                    .HasColumnName("NextAssigneeID");

                entity.Property(e => e.PrevAssigneeId)
                    .HasColumnType("int(11)")
                    .HasColumnName("PrevAssigneeID");

                entity.Property(e => e.ProcessExecutionId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessExecutionID");

                entity.Property(e => e.ProcessStepId).HasColumnType("int(11)");

                entity.Property(e => e.RejectReason)
                    .HasColumnType("text")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_bin");

                entity.Property(e => e.StepExecutionData)
                    .HasColumnType("longtext")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_bin");

                entity.HasOne(d => d.CurrentAssignee)
                    .WithMany(p => p.StepExecutionCurrentAssignees)
                    .HasForeignKey(d => d.CurrentAssigneeId)
                    .HasConstraintName("FK_step_execution_user_infor_UserID");

                entity.HasOne(d => d.NextAssignee)
                    .WithMany(p => p.StepExecutionNextAssignees)
                    .HasForeignKey(d => d.NextAssigneeId)
                    .HasConstraintName("FK_next_step_execution_user_infor_UserID");

                entity.HasOne(d => d.PrevAssignee)
                    .WithMany(p => p.StepExecutionPrevAssignees)
                    .HasForeignKey(d => d.PrevAssigneeId)
                    .HasConstraintName("FK_prev_step_execution_user_infor_UserID");

                entity.HasOne(d => d.ProcessExecution)
                    .WithMany(p => p.StepExecutions)
                    .HasForeignKey(d => d.ProcessExecutionId);

                entity.HasOne(d => d.ProcessStep)
                    .WithMany(p => p.StepExecutions)
                    .HasForeignKey(d => d.ProcessStepId)
                    .HasConstraintName("FK_step_execution_process_step_ProcessStepID");
            });

            modelBuilder.Entity<StepField>(entity =>
            {
                entity.ToTable("step_field");

                entity.HasIndex(e => e.ProcessStepId, "FK_step_field_process_step_ProcessStepID");

                entity.Property(e => e.StepFieldId)
                    .HasColumnType("int(11)")
                    .HasColumnName("StepFieldID");

                entity.Property(e => e.DataSetting)
                    .HasColumnType("longtext")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_bin");

                entity.Property(e => e.Description)
                    .HasColumnType("text")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.FieldName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ProcessStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessStepID");

                entity.Property(e => e.SortOrder).HasColumnType("int(11)");

                entity.Property(e => e.Type).HasColumnType("int(11)");

                entity.HasOne(d => d.ProcessStep)
                    .WithMany(p => p.StepFields)
                    .HasForeignKey(d => d.ProcessStepId);
            });

            modelBuilder.Entity<StepTask>(entity =>
            {
                entity.HasKey(e => e.TaskId)
                    .HasName("PRIMARY");

                entity.ToTable("step_task");

                entity.HasIndex(e => e.ProcessStepId, "FK_step_task_process_step_ProcessStepID");

                entity.Property(e => e.TaskId)
                    .HasColumnType("int(11)")
                    .HasColumnName("TaskID");

                entity.Property(e => e.ProcessStepId)
                    .HasColumnType("int(11)")
                    .HasColumnName("ProcessStepID");

                entity.Property(e => e.SortOrder).HasColumnType("int(11)");

                entity.Property(e => e.TaskName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.HasOne(d => d.ProcessStep)
                    .WithMany(p => p.StepTasks)
                    .HasForeignKey(d => d.ProcessStepId);
            });

            modelBuilder.Entity<UserGroup>(entity =>
            {
                entity.ToTable("user_group");

                entity.Property(e => e.UserGroupId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserGroupID");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.UserGroupName)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");
            });

            modelBuilder.Entity<UserGroupDetail>(entity =>
            {
                entity.ToTable("user_group_detail");

                entity.HasIndex(e => e.UserGroupId, "FK_user_group_detail_user_group_UserGroupID");

                entity.HasIndex(e => e.UserId, "FK_user_group_detail_user_infor_UserID");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("ID");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.UserGroupId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserGroupID");

                entity.Property(e => e.UserId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserID");

                entity.HasOne(d => d.UserGroup)
                    .WithMany(p => p.UserGroupDetails)
                    .HasForeignKey(d => d.UserGroupId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserGroupDetails)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<UserInfor>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("user_infor");

                entity.HasIndex(e => e.RoleId, "FK_user_infor");

                entity.Property(e => e.UserId)
                    .HasColumnType("int(11)")
                    .HasColumnName("UserID");

                entity.Property(e => e.Address)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.Property(e => e.Email)
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.FullName)
                    .HasColumnType("varchar(100)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("varchar(255)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Phone)
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.Property(e => e.RoleId)
                    .HasColumnType("int(11)")
                    .HasColumnName("RoleID");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserInfors)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_user_infor");
            });

            modelBuilder.Entity<UserLogin>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("user_login");

                entity.Property(e => e.UserId)
                    .HasColumnType("int(11)")
                    .ValueGeneratedNever()
                    .HasColumnName("UserID");

                entity.Property(e => e.IsFirstTimeLogin).HasColumnType("bit(1)");

                entity.Property(e => e.PasswordHash)
                .HasMaxLength(64)
                .IsFixedLength(true);

                entity.Property(e => e.PasswordSalt)
                    .HasMaxLength(128)
                    .IsFixedLength(true);

                entity.Property(e => e.Username)
                    .HasColumnType("varchar(50)")
                    .HasCharSet("utf8")
                    .HasCollation("utf8_bin");

                entity.HasOne(d => d.User)
                    .WithOne(p => p.UserLogin)
                    .HasForeignKey<UserLogin>(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
