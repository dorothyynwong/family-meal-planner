using System.Text.Json.Nodes;
using FamilyMealPlanner.Models;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IWebScrappingService
{
        Task<ImportRecipeResponse> GetRecipeFromUrl([FromRoute] string url);
}

public class WebScrappingService : IWebScrappingService
{
        private const string RecipeNodeName = "//script[@type='application/ld+json']";
        NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

        private string GetChildNodeValue(JsonNode jsonNode)
        {
                if (jsonNode == null)
                {
                        Logger.Error("Invalid json");
                        throw new InvalidOperationException("Invalid json");
                }

                if (jsonNode is JsonObject jsonObject)
                {
                        if (jsonObject.TryGetPropertyValue("@type", out JsonNode typeNode))
                        {
                                string type = typeNode.ToString();
                                string childToExtract = type switch
                                {
                                        "HowToStep" => "text",
                                        "ImageObject" => "url",
                                        "Person" => "name",
                                        "Organization" => "name",
                                        _ => ""
                                };

                                if (childToExtract != "" && jsonObject.TryGetPropertyValue(childToExtract, out JsonNode childNode))
                                {
                                        try
                                        {
                                                return childNode?.ToString();
                                        }
                                        catch
                                        {
                                                throw new InvalidOperationException($"Missing '{childToExtract}' field in {type}.");
                                        }
                                }
                                else
                                {
                                        throw new InvalidOperationException($"Missing expected field for type '{type}'.");
                                }

                        }
                        return jsonNode.ToString();
                }
                else
                {
                        return jsonNode.ToString();
                }

        }

        private List<string> ParseJsonNode(JsonNode parentNode)
        {
                List<string> listOfString = new List<string>();
                
                if (parentNode == null) 
                {
                        Logger.Error($"Parent Node is null");
                        throw new InvalidOperationException($"Unable to parse the JSON");
                }

                if (parentNode is JsonArray)
                {
                        foreach (JsonNode childNode in parentNode.AsArray())
                        {
                                listOfString.Add(GetChildNodeValue(childNode));
                        }
                }
                else
                {
                        listOfString.Add(GetChildNodeValue(parentNode));
                }
                return listOfString;
        }

        private async Task<string> GetRecipeJson([FromRoute] string url)
        {
                try
                {
                        var web = new HtmlWeb();
                        HtmlDocument document = await web.LoadFromWebAsync(url);
                        var recipeJsonElements = document.DocumentNode.SelectNodes(RecipeNodeName);
                        if (recipeJsonElements == null || recipeJsonElements.Count == 0)
                        {
                                Logger.Error($"{url} is an invalid recipe. ");
                                throw new InvalidOperationException($"{url} is an invalid recipe.");
                        }

                        var firstElement = recipeJsonElements.FirstOrDefault();
                        if (firstElement == null)
                        {
                                Logger.Error($"{url} does not contain a valid recipe node.");
                                throw new InvalidOperationException("No valid recipe node found.");
                        }

                        string json = firstElement.InnerText;
                        if (json.StartsWith("[") && json.EndsWith("]"))
                        {
                                json = json.Trim('[', ']');
                        }
                        return json;

                }
                catch (HtmlWebException ex)
                {
                        Logger.Error($"Error loading page from URL: {url}. Exception: {ex}");
                        throw new Exception($"Error loading recipe from {url}.", ex);
                }
                catch (Exception ex)
                {
                        Logger.Error($"Error scraping recipe: {ex.Message}");
                        throw new Exception("Error scraping recipe: " + ex.Message);
                }

        }


        public async Task<ImportRecipeResponse> GetRecipeFromUrl([FromRoute] string url)
        {
                string json = await GetRecipeJson(url);

                try
                {
                        JsonNode recipeNode = JsonNode.Parse(json);
                        var imageUrls = ParseJsonNode(recipeNode["image"]);
                        ImportRecipeResponse recipe = new ImportRecipeResponse
                        {
                                Name = recipeNode["name"] != null ? recipeNode["name"]!.ToString() : "",
                                Images = imageUrls,
                                Author = ParseJsonNode(recipeNode["author"])[0],
                                Url = url,
                                Description = recipeNode["description"] != null ? recipeNode["description"]!.ToString() : "",
                                RecipeCuisine = recipeNode["recipeCuisine"] != null ? recipeNode["recipeCuisine"]!.ToString() : "",
                                PrepTime = recipeNode["prepTime"] != null ? recipeNode["prepTime"]!.ToString() : "",
                                CookTime = recipeNode["cookTime"] != null ? recipeNode["cookTime"]!.ToString() : "",
                                TotalTime = recipeNode["totalTime"] != null ? recipeNode["totalTime"]!.ToString() : "",
                                Keywords = recipeNode["keywords"] != null ? recipeNode["keywords"]!.ToString() : "",
                                RecipeYield = recipeNode["recipeYield"] != null ? recipeNode["recipeYield"]!.ToString() : "",
                                RecipeCategory = recipeNode["recipecategory"] != null ? recipeNode["recipecategory"]!.ToString() : "",
                                RecipeIngredients = ParseJsonNode(recipeNode["recipeIngredient"]),
                                RecipeInstructions = ParseJsonNode(recipeNode["recipeInstructions"]),
                                DefaultImageUrl = imageUrls[0] != null ? imageUrls[0] : "",
                        };

                        return recipe;
                }
                catch (Exception ex)
                {
                        Logger.Error($"Unexpected error to parse recipe: {ex.Message}");
                        throw new Exception($"Unexpected error to parse recipe: {ex.Message}");
                }

        }

}



