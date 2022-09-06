using awillingham_site.Config;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using AspNetCoreRateLimit;

namespace awillingham_site.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddConfig(
            this IServiceCollection services, IConfiguration config)
        {
            services.Configure<AppOptions>(config.GetSection(AppOptions.Key));

            return services;
        }
        public static IServiceCollection AddCustomResponseCaching(
            this IServiceCollection services)
        {
            services.AddResponseCaching().AddControllers(options =>
            {
                options.CacheProfiles.Add("NoCache",
                    new CacheProfile
                    {
                        NoStore = true,
                        Location = ResponseCacheLocation.None,
                    });
                options.CacheProfiles.Add("OneDay",
                    new CacheProfile
                    {
                        Duration = 60 * 60 * 24
                    });
            });

            return services;
        }

        public static IServiceCollection AddCustomHttpsRedirection(
            this IServiceCollection services)
        {
            services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
                options.HttpsPort = 443;
            });

            return services;
        }
        public static IServiceCollection AddRateLimiting(
            this IServiceCollection services)
        {
            services.Configure<IpRateLimitOptions>(options =>
            {
                options.EnableEndpointRateLimiting = true;
                options.StackBlockedRequests = false;
                options.HttpStatusCode = 429;
                options.RealIpHeader = "X-Real-IP";
                options.ClientIdHeader = "X-ClientId";
                options.GeneralRules = new System.Collections.Generic.List<RateLimitRule>
                {
                    new RateLimitRule
                    {
                        Endpoint = "*",
                        Period = "1s",
                        Limit = 2,
                    },
                    new RateLimitRule
                    {
                        Endpoint = "*",
                        Period = "15m",
                        Limit = 100,
                    },
                    new RateLimitRule
                    {
                        Endpoint = "*",
                        Period = "12h",
                        Limit = 1000,
                    },
                    new RateLimitRule
                    {
                        Endpoint = "*",
                        Period = "7d",
                        Limit = 10000,
                    }
                };
            });
            services.AddInMemoryRateLimiting();
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            return services;
        }
    }
}
