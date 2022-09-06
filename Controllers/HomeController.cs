using Microsoft.AspNetCore.Mvc;

namespace awillingham_site.Controllers
{
    public class HomeController : Controller
    {

        [HttpGet]
        [ResponseCache(CacheProfileName = "NoCache")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [ResponseCache(CacheProfileName = "NoCache")]
        public IActionResult Error()
        {
            return View();
        }
    }
}
