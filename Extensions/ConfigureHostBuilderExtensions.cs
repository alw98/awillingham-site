namespace awillingham_site.Extensions
{
    public static class ConfigureHostBuilderExtensions
    {
        public static ConfigureHostBuilder ConfigureCustomAppConfiguration(
            this ConfigureHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((hostContext, builder) =>
            {
                var env = hostContext.HostingEnvironment;
                builder.SetBasePath(env.ContentRootPath)
                .AddJsonFile("./_config/config.json", optional: false)
                .AddJsonFile($"./_config/{env.EnvironmentName}.config.json", optional: true)
                .AddJsonFile("./_config/local.config.json", optional: true);
            });

            return builder;
        }

        public static ConfigureHostBuilder ConfigureCustomLogging(
            this ConfigureHostBuilder builder)
        {
            builder.ConfigureLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddConsole();
            });

            return builder;
        }
    }
}
