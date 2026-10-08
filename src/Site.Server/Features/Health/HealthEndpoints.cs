using Site.Server.Hosting;
using Site.Server.Http;

namespace Site.Server.Features.Health;

public sealed class HealthEndpoints(ClientAssets assets) : ISiteEndpoints
{
    public void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapMethods("/health/live", ["GET", "HEAD"], (HttpContext context) => ApiProblems.WriteJson(context, new { status = "healthy" }));
        endpoints.MapMethods("/health/ready", ["GET", "HEAD"], (HttpContext context) =>
            ApiProblems.WriteJson(context, new { status = assets.Ready ? "healthy" : "unhealthy" }, assets.Ready ? 200 : 503));
    }
}
