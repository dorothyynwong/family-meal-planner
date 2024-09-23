using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/recipes")]
public class RecipeController(IWebScrappingService webScrappingService) : Controller
{
    private readonly IWebScrappingService _webScrappingService = webScrappingService ;

    [HttpGet("url")]
    public async Task<IActionResult> GetRecipeJsonByUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("URL cannot be null or empty.");
        }
        string json = await _webScrappingService.GetRecipeJson(url);
        return Ok(json);
    }

    [HttpGet("")]
    public async Task<IActionResult> GetRecipeByUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("URL cannot be null or empty.");
        }
        var recipe = await _webScrappingService.GetRecipeFromUrl(url);
        return Ok(recipe);
    }
}