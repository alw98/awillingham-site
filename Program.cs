using AspNetCoreRateLimit;
using awillingham_site.Extensions;
using Microsoft.Extensions.Hosting.Systemd;

namespace awillingham_site
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = CreateBuilder(args);

            ConfigureServices(builder.Services, builder.Configuration);

            var app = builder.Build();

            ConfigureApp(app, builder.Environment);

            app.Run();
        }

        private static WebApplicationBuilder CreateBuilder(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Host.ConfigureCustomAppConfiguration();
            builder.Host.ConfigureCustomLogging();
            builder.Host.UseSystemd();

            return builder;
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            services.AddConfig(config);
            services.AddControllersWithViews();
            services.AddCustomResponseCaching();
            services.AddCustomHttpsRedirection();
            services.AddRateLimiting();
        }
        
        private static void ConfigureApp(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCustomForwardedHeaders();
            app.UseCustomExceptionPage(env);
            app.UseIpRateLimiting();
            app.UseHttpsRedirection();
            app.UseHsts();
            app.UseStaticFiles();
            app.UseResponseCaching();
            app.UseRouting();
            app.UseCustomEndpoints();
        }
    }
}