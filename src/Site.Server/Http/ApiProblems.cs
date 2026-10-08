using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Site.Server.Http;

public static class ApiProblems
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);
    public static bool IsReserved(PathString path) => new[] { "/api", "/auth", "/health" }
        .Any(prefix => path.StartsWithSegments(prefix, StringComparison.OrdinalIgnoreCase));

    public static Task Write(HttpContext context, int status, IDictionary<string, string[]>? errors = null)
    {
        var problem = errors is null ? new ProblemDetails() : new HttpValidationProblemDetails(errors);
        problem.Type = "about:blank";
        problem.Title = ReasonPhrases.GetReasonPhrase(status);
        problem.Status = status;
        problem.Instance = context.Request.Path.Value;
        problem.Extensions["code"] = status switch
        {
            400 => "validation_failed", 401 => "unauthenticated", 403 => "forbidden",
            404 => "not_found", 405 => "method_not_allowed", _ => "internal_error"
        };
        problem.Extensions["traceId"] = context.TraceIdentifier;
        return WriteJson(context, problem, status, "application/problem+json");
    }

    public static async Task WriteJson<T>(HttpContext context, T value, int status = 200, string contentType = "application/json")
    {
        // Serialize using the actual type so validation field errors are retained.
        var bytes = JsonSerializer.SerializeToUtf8Bytes(value, value?.GetType() ?? typeof(T), Json);
        context.Response.StatusCode = status;
        context.Response.ContentType = contentType;
        context.Response.ContentLength = bytes.Length;
        context.Response.Headers.CacheControl = "no-store";
        if (!HttpMethods.IsHead(context.Request.Method)) await context.Response.Body.WriteAsync(bytes, context.RequestAborted);
    }
}
