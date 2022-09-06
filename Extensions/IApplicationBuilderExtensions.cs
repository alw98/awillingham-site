using awillingham_site.Config;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.HttpOverrides;

namespace awillingham_site.Extensions
{
    public static class IApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseCustomForwardedHeaders(
            this IApplicationBuilder app)
        { 
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            return app;
        }

        public static IApplicationBuilder UseCustomExceptionPage(
            this IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.EnvironmentName == "Development")
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            return app;
        }
    }
}
