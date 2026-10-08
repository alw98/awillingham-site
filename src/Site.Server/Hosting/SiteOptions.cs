using Microsoft.Extensions.Options;

namespace Site.Server.Hosting;

public sealed class SiteOptions
{
    public string ClientMode { get; set; } = "ApiOnly";
    public string ClientAssetsPath { get; set; } = "wwwroot";
}

public sealed class ProxyOptions { public string[] TrustedProxies { get; set; } = []; }

public sealed class SiteOptionsValidator(IHostEnvironment environment) : IValidateOptions<SiteOptions>
{
    public ValidateOptionsResult Validate(string? name, SiteOptions options)
    {
        if (options.ClientMode is not ("ApiOnly" or "Integrated")) return ValidateOptionsResult.Fail("Site:ClientMode must be ApiOnly or Integrated.");
        if (string.IsNullOrWhiteSpace(options.ClientAssetsPath) || Path.IsPathFullyQualified(options.ClientAssetsPath))
            return ValidateOptionsResult.Fail("Site:ClientAssetsPath must be a relative directory inside the content root.");
        try
        {
            var root = Path.GetFullPath(environment.ContentRootPath).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
            var assets = Path.GetFullPath(Path.Combine(root, options.ClientAssetsPath));
            if (!assets.StartsWith(root, OperatingSystem.IsWindows() ? StringComparison.OrdinalIgnoreCase : StringComparison.Ordinal))
                return ValidateOptionsResult.Fail("Site:ClientAssetsPath must stay inside the content root.");
            if (options.ClientMode == "Integrated" && ClientAssets.RequiredFiles.Any(file => !File.Exists(Path.Combine(assets, file))))
                return ValidateOptionsResult.Fail("Integrated client assets are incomplete. Build the client before publishing the server.");
        }
        catch (Exception error) when (error is ArgumentException or NotSupportedException or PathTooLongException)
        {
            return ValidateOptionsResult.Fail("Site:ClientAssetsPath is invalid.");
        }
        return ValidateOptionsResult.Success;
    }
}
