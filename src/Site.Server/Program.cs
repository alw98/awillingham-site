using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;
using Site.Server.Features.Health;
using Site.Server.Hosting;
using Site.Server.Http;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOptions<SiteOptions>()
    .Configure(options => options.ClientMode = builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Testing") ? "ApiOnly" : "Integrated")
    .BindConfiguration("Site").ValidateOnStart();
builder.Services.AddSingleton<IValidateOptions<SiteOptions>, SiteOptionsValidator>();
builder.Services.AddOptions<ProxyOptions>().BindConfiguration("Proxy")
    .Validate(options => options.TrustedProxies.All(value => System.Net.IPAddress.TryParse(value, out _)),
        "Proxy:TrustedProxies must contain IP addresses.").ValidateOnStart();
builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteHandlerOptions>(options => options.ThrowOnBadRequest = true);
builder.Services.AddSingleton<ClientAssets>();
builder.Services.AddSingleton<ISiteEndpoints, HealthEndpoints>();

var app = builder.Build();
// Materialize validated paths before accepting traffic, not on the first request.
var assets = app.Services.GetRequiredService<ClientAssets>();
var proxies = app.Services.GetRequiredService<IOptions<ProxyOptions>>().Value;
app.UseMiddleware<ApiErrors>();
if (proxies.TrustedProxies.Length > 0)
{
    var forwarded = new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto, ForwardLimit = 1 };
    forwarded.KnownIPNetworks.Clear();
    forwarded.KnownProxies.Clear();
    foreach (var address in proxies.TrustedProxies) forwarded.KnownProxies.Add(System.Net.IPAddress.Parse(address));
    app.UseForwardedHeaders(forwarded);
}
app.UseRouting();
app.UseMiddleware<ClientRouting>();
if (assets.Integrated)
{
    var types = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
    types.Mappings[".data"] = "text/x-script";
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = assets.Provider,
        ContentTypeProvider = types,
        OnPrepareResponse = context => context.Context.Response.Headers.CacheControl =
            ClientRouting.IsHashedAsset(context.Context.Request.Path) ? "public, max-age=31536000, immutable" : "no-cache"
    });
}
foreach (var endpoints in app.Services.GetServices<ISiteEndpoints>()) endpoints.Map(app);
app.Run();

public partial class Program;
