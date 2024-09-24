using System.Text.Json;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/recipes")]
public class RecipeController(IWebScrappingService webScrappingService, IRecipeService recipeService, IImageService imageService) : Controller
{
    private readonly IWebScrappingService _webScrappingService = webScrappingService ;
    private readonly IRecipeService _recipeService = recipeService ;
    private readonly IImageService _imageService = imageService;

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
    public async Task<IActionResult> Add(RecipeRequest recipe)
    {
        Logger.Info("add recipe", recipe.Name);
        await _recipeService.AddRecipe(recipe);
        return Ok();
    }

    [HttpGet("{recipeId}")]
    public async Task<IActionResult> GetById([FromRoute]int recipeId)
    {
        Logger.Info("get recipe by Id", recipeId);
        Recipe recipe = await _recipeService.GetRecipeById(recipeId);
        
        return Ok(recipe);
    }

    [HttpPut("{recipeId}")]
    public async Task<IActionResult> Update(RecipeRequest recipeRequest, [FromRoute]int recipeId)
    {
        Logger.Info("update recipe", recipeId);
        await _recipeService.UpdateRecipe(recipeRequest, recipeId);
        
        return Ok(recipeRequest);
    }

    
    [HttpDelete("{recipeId}")]
    public async Task<IActionResult> Delete([FromRoute]int recipeId)
    {
        Logger.Info("delete recipe", recipeId);
        await _recipeService.Delete(recipeId);
        
        return Ok();
    }

    [HttpPost("upload")]
    public async Task<ImgurResponse> UploadImage([FromForm] IFormFile uploadImage)
    {
        var response = await _imageService.UploadImageAsync();
        ImgurResponse imgurResponse = JsonSerializer.Deserialize<ImgurResponse>(response);
        return imgurResponse;
    }
}