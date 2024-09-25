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
    private readonly IWebScrappingService _webScrappingService = webScrappingService;
    private readonly IRecipeService _recipeService = recipeService;
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
    public async Task<IActionResult> GetById([FromRoute] int recipeId)
    {
        Logger.Info("get recipe by Id", recipeId);
        Recipe recipe = await _recipeService.GetRecipeById(recipeId);

        return Ok(recipe);
    }

    [HttpPut("{recipeId}")]
    public async Task<IActionResult> Update(RecipeRequest recipeRequest, [FromRoute] int recipeId)
    {
        Logger.Info("update recipe", recipeId);
        await _recipeService.UpdateRecipe(recipeRequest, recipeId);

        return Ok(recipeRequest);
    }


    [HttpDelete("{recipeId}")]
    public async Task<IActionResult> Delete([FromRoute] int recipeId)
    {
        Logger.Info("delete recipe", recipeId);
        await _recipeService.Delete(recipeId);

        return Ok();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile uploadImage)
    {
        Logger.Info("upload photo");
        if (uploadImage == null || uploadImage.Length == 0)
        {
            return BadRequest("No image uploaded.");
        }

        var response = await _imageService.UploadImageAsync(uploadImage);
        // var response = "{\"data\":{\"id\":\"VwKM46z\",\"title\":\"oigsuxtf-wv5\",\"url_viewer\":\"https://ibb.co/VwKM46z\",\"url\":\"https://i.ibb.co/vXtLn9T/oigsuxtf-wv5.jpg\",\"display_url\":\"https://i.ibb.co/Bn1TMkQ/oigsuxtf-wv5.jpg\",\"width\":3784,\"height\":2764,\"size\":713675,\"time\":1727268882,\"expiration\":0,\"image\":{\"filename\":\"oigsuxtf-wv5.jpg\",\"name\":\"oigsuxtf-wv5\",\"mime\":\"image/jpeg\",\"extension\":\"jpg\",\"url\":\"https://i.ibb.co/vXtLn9T/oigsuxtf-wv5.jpg\"},\"thumb\":{\"filename\":\"oigsuxtf-wv5.jpg\",\"name\":\"oigsuxtf-wv5\",\"mime\":\"image/jpeg\",\"extension\":\"jpg\",\"url\":\"https://i.ibb.co/VwKM46z/oigsuxtf-wv5.jpg\"},\"medium\":{\"filename\":\"oigsuxtf-wv5.jpg\",\"name\":\"oigsuxtf-wv5\",\"mime\":\"image/jpeg\",\"extension\":\"jpg\",\"url\":\"https://i.ibb.co/Bn1TMkQ/oigsuxtf-wv5.jpg\"},\"delete_url\":\"https://ibb.co/VwKM46z/a6409b7b33a58dc2cb928bbb47695479\"},\"success\":true,\"status\":200}";
        // ImgurResponse imgurResponse = JsonSerializer.Deserialize<ImgurResponse>(response);

        try
        {
            ImgBBResponse imgBBResponse = JsonSerializer.Deserialize<ImgBBResponse>(response);
            Logger.Info(imgBBResponse.ImgData.DisplayUrl);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error(ex.Message);
            return BadRequest(ex.Message);
        }




        
    }
}