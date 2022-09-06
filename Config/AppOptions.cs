using System.ComponentModel.DataAnnotations;

namespace awillingham_site.Config
{
    public class AppOptions
    {
        [Required]
        public string? GithubSecret { get; set; } = default;

        public static string Key = "AppOptions";
    }
}
