using System.Text.Json;

namespace Site.Server.Hosting;

public sealed class GalleryRoutes
{
    public Dictionary<string, string> Aliases { get; } = new(StringComparer.Ordinal);
    public HashSet<string> Canonical { get; } = new(StringComparer.Ordinal) { "/", "/gallery", "/colors", "/projecteuler", "/timer" };

    public GalleryRoutes()
    {
        using var document = JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "legacy-gallery.json")));
        foreach (var preset in document.RootElement.GetProperty("presets").EnumerateArray())
        {
            var target = "/gallery/" + preset.GetProperty("slug").GetString();
            Canonical.Add(target);
            // Preserve the first Times Tables registration's legacy destination.
            Aliases.TryAdd("/gallery/" + preset.GetProperty("legacyName").GetString(), target);
        }
    }
}
