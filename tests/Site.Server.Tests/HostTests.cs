using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Site.Server.Http;
using Xunit;

namespace Site.Server.Tests;

public sealed class HostTests
{
    [Theory]
    [InlineData("/health/live")]
    [InlineData("/health/ready")]
    public async Task Anonymous_health_and_head_have_the_same_headers_without_a_head_body(string path)
    {
        using var factory = new SiteFactory();
        using var client = factory.CreateClient();
        using var get = await client.GetAsync(path, TestContext.Current.CancellationToken);
        using var head = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, path), TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);
        Assert.Equal("{\"status\":\"healthy\"}", await get.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
        Assert.Equal("application/json", get.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-store", get.Headers.CacheControl?.ToString());
        Assert.Equal(get.StatusCode, head.StatusCode);
        Assert.Equal(get.Content.Headers.ContentLength, head.Content.Headers.ContentLength);
        Assert.Empty(await head.Content.ReadAsByteArrayAsync(TestContext.Current.CancellationToken));
    }

    [Theory]
    [InlineData("/api")]
    [InlineData("/api/missing")]
    [InlineData("/API/missing")]
    [InlineData("/auth/callback/provider")]
    [InlineData("/health/missing")]
    public async Task Reserved_misses_are_json_even_when_html_is_requested(string path)
    {
        using var factory = new SiteFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, path + "?private=not-in-instance");
        request.Headers.Accept.ParseAdd("text/html");
        using var response = await client.SendAsync(request, TestContext.Current.CancellationToken);
        var problem = await AssertProblem(response, 404, "not_found");
        Assert.Equal(path, problem.GetProperty("instance").GetString());
        Assert.DoesNotContain("private", problem.GetRawText());
    }

    [Fact]
    public async Task Errors_are_sanitized_and_validation_fields_are_retained()
    {
        using var factory = new SiteFactory();
        using var client = factory.CreateClient();
        using var failure = await client.GetAsync("/api/_test/throw", TestContext.Current.CancellationToken);
        var problem = await AssertProblem(failure, 500, "internal_error");
        Assert.DoesNotContain("private-test-message", problem.GetRawText());
        Assert.False(problem.TryGetProperty("detail", out _));
        using var validation = await client.PostAsync("/api/_test/validation", null, TestContext.Current.CancellationToken);
        var fields = await AssertProblem(validation, 400, "validation_failed");
        Assert.Equal("A name is required.", fields.GetProperty("errors").GetProperty("name")[0].GetString());
        using var badBody = await client.PostAsync("/api/_test/echo", new StringContent("{", System.Text.Encoding.UTF8, "application/json"), TestContext.Current.CancellationToken);
        await AssertProblem(badBody, 400, "validation_failed");
    }

    [Fact]
    public async Task Mapped_method_errors_are_json_and_preserve_allow()
    {
        using var factory = new SiteFactory();
        using var client = factory.CreateClient();
        using var response = await client.PostAsync("/health/live", null, TestContext.Current.CancellationToken);
        await AssertProblem(response, 405, "method_not_allowed");
        Assert.Contains("GET", response.Content.Headers.Allow);
    }

    [Theory]
    [InlineData("Site:ClientMode", "Unknown", "ClientMode")]
    [InlineData("Site:ClientAssetsPath", "../outside", "content root")]
    [InlineData("Features:Accounts:Enabled", "true", "unavailable")]
    [InlineData("Features:DataSync:Enabled", "true", "unavailable")]
    [InlineData("Proxy:TrustedProxies:0", "not-an-ip", "IP addresses")]
    public void Invalid_configuration_fails_before_accepting_traffic(string key, string value, string diagnostic)
    {
        using var factory = new SiteFactory(settings: new() { [key] = value });
        var error = Assert.ThrowsAny<Exception>(() => factory.CreateClient());
        Assert.Contains(diagnostic, error.ToString());
    }

    [Fact]
    public void Production_requires_complete_packaged_assets()
    {
        using var missing = new SiteFactory(mode: null, environment: "Production");
        var error = Assert.ThrowsAny<Exception>(() => missing.CreateClient());
        Assert.Contains("assets are incomplete", error.ToString());
        using var complete = new SiteFactory(mode: null, environment: "Production", withAssets: true);
        using var client = complete.CreateClient();
        Assert.NotNull(client);
    }

    [Fact]
    public async Task Readiness_tracks_assets_while_liveness_remains_healthy()
    {
        using var factory = new SiteFactory("Integrated", withAssets: true);
        using var client = factory.CreateClient();
        File.Delete(Path.Combine(factory.Root, "wwwroot/gallery/index.html"));
        using var ready = await client.GetAsync("/health/ready", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.ServiceUnavailable, ready.StatusCode);
        Assert.Equal("{\"status\":\"unhealthy\"}", await ready.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
        using var head = await client.SendAsync(new HttpRequestMessage(HttpMethod.Head, "/health/ready"), TestContext.Current.CancellationToken);
        Assert.Equal(ready.StatusCode, head.StatusCode);
        Assert.Equal(ready.Content.Headers.ContentType, head.Content.Headers.ContentType);
        Assert.Equal(ready.Content.Headers.ContentLength, head.Content.Headers.ContentLength);
        Assert.Empty(await head.Content.ReadAsByteArrayAsync(TestContext.Current.CancellationToken));
        using var live = await client.GetAsync("/health/live", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, live.StatusCode);
    }

    [Theory]
    [InlineData("/", "home")]
    [InlineData("/gallery", "gallery")]
    [InlineData("/colors", "fallback")]
    [InlineData("/gallery/tetris", "fallback")]
    [InlineData("/unknown-client-url", "fallback")]
    [InlineData("/apiary", "fallback")]
    public async Task Integrated_navigation_serves_the_correct_html(string path, string expected)
    {
        using var factory = new SiteFactory("Integrated", withAssets: true);
        using var client = factory.CreateClient();
        using var response = await client.GetAsync(path, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-cache", response.Headers.CacheControl?.ToString());
        Assert.Equal(expected, await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Theory]
    [InlineData("/assets/missing.js")]
    [InlineData("/images/missing")]
    [InlineData("/nested/missing.css")]
    [InlineData("/not.a.route/path")]
    [InlineData("/shaders/missing.frag")]
    [InlineData("/unknown.xyz")]
    public async Task Missing_assets_do_not_receive_html_or_immutable_caching(string path)
    {
        using var factory = new SiteFactory("Integrated", withAssets: true);
        using var client = factory.CreateClient();
        using var response = await client.GetAsync(path, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Empty(await response.Content.ReadAsByteArrayAsync(TestContext.Current.CancellationToken));
        Assert.DoesNotContain("immutable", response.Headers.CacheControl?.ToString() ?? "");
    }

    [Fact]
    public async Task Real_files_have_mime_and_cache_policy_and_cannot_override_api_routes()
    {
        using var factory = new SiteFactory("Integrated", withAssets: true);
        using var client = factory.CreateClient();
        using var asset = await client.GetAsync("/assets/app-abcdefgh.js", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, asset.StatusCode);
        Assert.Contains("immutable", asset.Headers.CacheControl!.ToString());
        Assert.Equal("text/javascript", asset.Content.Headers.ContentType?.MediaType);
        using var data = await client.GetAsync("/gallery.data", TestContext.Current.CancellationToken);
        Assert.Equal("text/x-script", data.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-cache", data.Headers.CacheControl?.ToString());
        using var secret = await client.GetAsync("/api/do-not-serve.txt", TestContext.Current.CancellationToken);
        await AssertProblem(secret, 404, "not_found");
        using var nonNavigation = new HttpRequestMessage(HttpMethod.Get, "/colors");
        nonNavigation.Headers.Accept.ParseAdd("application/json");
        using var response = await client.SendAsync(nonNavigation, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Theory]
    [InlineData("/gallery/Tetris?from=old", "/gallery/tetris?from=old")]
    [InlineData("/gallery/TimesTables", "/gallery/times-tables-animated")]
    [InlineData("/gallery/BouncyDVD/", "/gallery/bouncy-dvd")]
    [InlineData("/gallery/", "/gallery")]
    public async Task Legacy_and_trailing_slash_redirects_are_permanent_and_preserve_query(string path, string target)
    {
        using var factory = new SiteFactory("Integrated", withAssets: true);
        using var client = factory.CreateClient(new() { AllowAutoRedirect = false });
        using var response = await client.GetAsync(path, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.PermanentRedirect, response.StatusCode);
        Assert.Equal(target, response.Headers.Location?.OriginalString);
    }

    [Fact]
    public async Task Forwarded_headers_are_ignored_without_explicit_trusted_proxies()
    {
        using var factory = new SiteFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/_test/scheme");
        request.Headers.Add("X-Forwarded-Proto", "https");
        using var response = await client.SendAsync(request, TestContext.Current.CancellationToken);
        Assert.Equal("http", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    private static async Task<JsonElement> AssertProblem(HttpResponseMessage response, int status, string code)
    {
        Assert.Equal(status, (int)response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-store", response.Headers.CacheControl?.ToString());
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken);
        Assert.Equal("about:blank", problem.GetProperty("type").GetString());
        Assert.Equal(status, problem.GetProperty("status").GetInt32());
        Assert.Equal(code, problem.GetProperty("code").GetString());
        Assert.False(string.IsNullOrWhiteSpace(problem.GetProperty("traceId").GetString()));
        return problem;
    }
}

internal sealed class SiteFactory : WebApplicationFactory<Program>
{
    public string Root { get; } = Path.Combine(Path.GetTempPath(), "gallery-host-test-" + Guid.NewGuid().ToString("N"));
    private readonly string? mode;
    private readonly string environment;
    private readonly Dictionary<string, string?> settings;
    public SiteFactory(string? mode = "ApiOnly", string environment = "Testing", bool withAssets = false, Dictionary<string, string?>? settings = null)
    {
        this.mode = mode;
        this.environment = environment;
        this.settings = settings ?? [];
        Directory.CreateDirectory(Root);
        if (!withAssets) return;
        foreach (var (path, content) in new[] { ("index.html", "home"), ("gallery/index.html", "gallery"), ("__spa-fallback.html", "fallback"),
            ("assets/app-abcdefgh.js", "console.log('asset');"), ("gallery.data", "data"), ("api/do-not-serve.txt", "must not be served") })
        {
            var full = Path.Combine(Root, "wwwroot", path);
            Directory.CreateDirectory(Path.GetDirectoryName(full)!);
            File.WriteAllText(full, content);
        }
    }
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment(environment).UseContentRoot(Root);
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            var values = new Dictionary<string, string?> { ["Features:Accounts:Enabled"] = "false", ["Features:DataSync:Enabled"] = "false" };
            if (mode is not null) values["Site:ClientMode"] = mode;
            foreach (var pair in settings) values[pair.Key] = pair.Value;
            configuration.AddInMemoryCollection(values);
        });
        builder.ConfigureServices(services => services.AddSingleton<ISiteEndpoints, TestEndpoints>());
    }
    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing && Directory.Exists(Root)) Directory.Delete(Root, recursive: true);
    }
}

internal sealed class TestEndpoints : ISiteEndpoints
{
    public void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/_test/throw", (HttpContext _) => Task.FromException(new InvalidOperationException("private-test-message")));
        endpoints.MapPost("/api/_test/validation", (HttpContext context) => ApiProblems.Write(context, 400, new Dictionary<string, string[]> { ["name"] = ["A name is required."] }));
        endpoints.MapPost("/api/_test/echo", (Echo value) => Results.Json(value));
        endpoints.MapGet("/api/_test/scheme", (HttpContext context) => Results.Text(context.Request.Scheme));
    }
    private sealed record Echo(string Name);
}
