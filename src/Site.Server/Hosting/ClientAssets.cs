using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace Site.Server.Hosting;

public sealed class ClientAssets : IDisposable
{
    public static readonly string[] RequiredFiles = ["index.html", "gallery/index.html", "__spa-fallback.html"];
    public bool Integrated { get; }
    public string Root { get; }
    public IFileProvider Provider { get; }
    public bool Ready => !Integrated || RequiredFiles.All(file => File.Exists(Path.Combine(Root, file)));

    public ClientAssets(IOptions<SiteOptions> options, IHostEnvironment environment)
    {
        Integrated = options.Value.ClientMode == "Integrated";
        Root = Path.GetFullPath(Path.Combine(environment.ContentRootPath, options.Value.ClientAssetsPath));
        Provider = Integrated ? new PhysicalFileProvider(Root) : new NullFileProvider();
    }
    public void Dispose() => (Provider as IDisposable)?.Dispose();
}
