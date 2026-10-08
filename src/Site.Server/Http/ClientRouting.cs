using Site.Server.Hosting;

namespace Site.Server.Http;

public sealed partial class ClientRouting(RequestDelegate next, ClientAssets assets)
{
    public static bool IsHashedAsset(PathString path) => path.StartsWithSegments("/assets") && HashedName().IsMatch(path.Value ?? "");
    [System.Text.RegularExpressions.GeneratedRegex(@"-[a-zA-Z0-9_-]{8,}\.[a-zA-Z0-9]+$")]
    private static partial System.Text.RegularExpressions.Regex HashedName();

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path;
        var navigationMethod = HttpMethods.IsGet(context.Request.Method) || HttpMethods.IsHead(context.Request.Method);
        if (context.GetEndpoint() is null && ApiProblems.IsReserved(path))
        {
            await ApiProblems.Write(context, 404);
            return;
        }
        await next(context);
        if (context.Response.StatusCode != 404 || context.Response.HasStarted || context.GetEndpoint() is not null) return;
        if (!assets.Integrated || !navigationMethod || ApiProblems.IsReserved(path) ||
            path.StartsWithSegments("/assets", StringComparison.OrdinalIgnoreCase) ||
            (path.Value ?? "").Split('/').Any(segment => segment.Contains('.')) || !AcceptsHtml(context.Request)) return;
        var file = path.Value switch { "/" => "index.html", "/gallery" => "gallery/index.html", _ => "__spa-fallback.html" };
        context.Response.StatusCode = 200;
        context.Response.ContentType = "text/html; charset=utf-8";
        context.Response.Headers.CacheControl = "no-cache";
        var info = assets.Provider.GetFileInfo(file);
        if (!info.Exists) { context.Response.StatusCode = 503; return; }
        context.Response.ContentLength = info.Length;
        if (!HttpMethods.IsHead(context.Request.Method)) await context.Response.SendFileAsync(info, context.RequestAborted);
    }

    private static bool AcceptsHtml(HttpRequest request)
    {
        try
        {
            var accept = request.GetTypedHeaders().Accept;
            return accept is null || accept.Count == 0 || accept.Any(type => type.Quality != 0 && (type.MediaType == "text/html" || type.MediaType == "*/*"));
        }
        catch (FormatException) { return false; }
    }
}
