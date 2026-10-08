namespace Site.Server.Http;

public sealed class ApiErrors(RequestDelegate next, ILogger<ApiErrors> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
            if (!context.Response.HasStarted && context.Response.ContentType is null && context.Response.StatusCode >= 400 && ApiProblems.IsReserved(context.Request.Path))
                await ApiProblems.Write(context, context.Response.StatusCode);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested) { }
        catch (BadHttpRequestException error) when (!context.Response.HasStarted)
        {
            context.Response.Clear();
            await ApiProblems.Write(context, error.StatusCode, new Dictionary<string, string[]> { ["$"] = ["The request could not be read."] });
        }
        catch (Exception error) when (!context.Response.HasStarted)
        {
            logger.LogError(error, "Request failed with trace {TraceId}", context.TraceIdentifier);
            context.Response.Clear();
            await ApiProblems.Write(context, 500);
        }
    }
}
