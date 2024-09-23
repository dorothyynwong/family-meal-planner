using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/recipes")]
public class RecipeController(IWebScrappingService webScrappingService, IRecipeService recipeService) : Controller
{
    private readonly IWebScrappingService _webScrappingService = webScrappingService ;
    private readonly IRecipeService _recipeService = recipeService ;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

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

    [HttpGet("import")]
    public async Task<IActionResult> GetRecipeByUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("URL cannot be null or empty.");
        }
        var recipe = await _webScrappingService.GetRecipeFromUrl(url);
        return Ok(recipe);
    }

    [HttpPost("")]
    public async Task<IActionResult> AddRecipe(RecipeRequest recipe)
    {
        Logger.Info("recipe", recipe.Name);
        await _recipeService.AddRecipe(recipe);
        return Ok();
    }
}