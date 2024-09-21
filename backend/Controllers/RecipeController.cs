using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/recipes")]
public class RecipeController(IWebScrappingService webScrappingService) : Controller
{
    private readonly IWebScrappingService _webScrappingService = webScrappingService ;

    [HttpGet("url")]
    public async Task<IActionResult> GetRecipeByUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("URL cannot be null or empty.");
        }
        string json = await _webScrappingService.GetRecipeJson(url);
        return Ok(json);
    }
}