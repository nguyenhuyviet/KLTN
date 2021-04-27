using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BusinessAccess.Services;
using DataAccess;
using DataAccess.Infrastructure;
using Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;

namespace WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var sqlconnectionstring = Configuration.GetConnectionString("mysqlconnection");
            services.AddDbContext<ProcessManagementDbContext>(options =>
              options.UseMySql(sqlconnectionstring, new MySqlServerVersion(new Version(10, 3, 23)))
          );


            services.AddCors();

            #region Add service

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProcessService, ProcessService>();
            services.AddScoped<IProcessExecutionService, ProcessExecutionService>();

            #endregion

            #region Add Repository


            services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddTransient(typeof(IRepository<>), typeof(RepositoryBase<>));


            #endregion

            services.AddControllersWithViews()
          .AddNewtonsoftJson(options =>
          options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        var userIDClaim = context.Principal.Claims.Where(x => x.Type == "UserID").First();
                        if (userIDClaim == null)
                        {
                            context.Fail("Unauthorized");
                        }
                        else
                        {
                            var userId =int.Parse(context.Principal.Claims.Where(x => x.Type == "UserID").First().Value);
                            var user = userService.GetUserLoginById(userId);
                            if (user.Data == null)
                            {
                                // return unauthorized if user no longer exists
                                context.Fail("Unauthorized");
                            }
                        }
                        return Task.CompletedTask;
                    }
                };
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddControllers().AddNewtonsoftJson(opt =>
                opt.SerializerSettings.ContractResolver = new DefaultContractResolver());

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(x => x
               .AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
