using System.Text.Json;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NLog;
using System.Security.Claims;

namespace FamilyMealPlanner.Controllers;

[Authorize]
[ApiController]
[Route("/recipes")]
public class RecipeController(IWebScrappingService webScrappingService, IRecipeService recipeService, IImageService imageService) : Controller
{
    private readonly IWebScrappingService _webScrappingService = webScrappingService;
    private readonly IRecipeService _recipeService = recipeService;
    private readonly IImageService _imageService = imageService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet("import-recipe")]
    public async Task<IActionResult> GetRecipeByUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("URL cannot be null or empty.");
        }

        try
        {
            var recipe = await _webScrappingService.GetRecipeFromUrl(url);
            return Ok(recipe);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to import recipe: {ex.Message}");
            return BadRequest($"Unable to import recipe: {ex.Message}");
        }
    }

    [HttpPost("")]
    public async Task<IActionResult> Add(RecipeRequest recipe)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            int recipeId = await _recipeService.AddRecipe(recipe);
            return Ok(recipeId);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add recipe: {ex.Message}");
            return BadRequest($"Unable to add recipe: {ex.Message}");
        }

    }

    [HttpGet("{recipeId}")]
    public async Task<IActionResult> GetById([FromRoute] int recipeId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            Recipe recipe = await _recipeService.GetRecipeById(recipeId);
            return Ok(recipe);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get recipe {recipeId}: {ex.Message}");
            return BadRequest($"Unable to get recipe {recipeId}: {ex.Message}");
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetByUserId()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        Logger.Debug(userId);

        try
        {
            List<Recipe> recipes = await _recipeService.GetRecipeByUserId(userId);
            return Ok(recipes);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get recipes of {userId}: {ex.Message}");
            return BadRequest($"Unable to get recipes of {userId}: {ex.Message}");
        }

    }

    [HttpPut("{recipeId}")]
    public async Task<IActionResult> Update(RecipeRequest recipeRequest, [FromRoute] int recipeId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            await _recipeService.UpdateRecipe(recipeRequest, recipeId);
            return Ok(recipeRequest);
        }
        catch (Exception ex)
        {
            string requestJson = JsonSerializer.Serialize(recipeRequest, new JsonSerializerOptions { WriteIndented = true });
            Logger.Error($"Failed to update recipe {recipeId}, {requestJson}: {ex.Message}");
            return BadRequest($"Unable to update recipe {recipeId}: {ex.Message}");
        }
    }


    [HttpDelete("{recipeId}")]
    public async Task<IActionResult> Delete([FromRoute] int recipeId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            await _recipeService.Delete(recipeId);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get recipe {recipeId}: {ex.Message}");
            return BadRequest($"Unable to get recipe {recipeId}: {ex.Message}");
        }
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile uploadImage)
    {
        if (uploadImage == null || uploadImage.Length == 0)
        {
            Logger.Error("Empty image");
            return BadRequest("Empty Image");
        }

        try
        {
            var response = await _imageService.UploadImageAsync(uploadImage);
            ImgBBResponse imgBBResponse = JsonSerializer.Deserialize<ImgBBResponse>(response);
            return Ok(imgBBResponse.ImgData.DisplayUrl);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unable to upload image: {ex.Message}");
            return BadRequest($"Unable to upload image: {ex.Message}");
        }
    }
}