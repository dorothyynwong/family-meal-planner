using System.Text.Json.Nodes;
using FamilyMealPlanner.Models;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;

namespace FamilyMealPlanner.Services;

public interface IWebScrappingService
{
        Task<string> GetRecipeJson(string url);
        Task<Recipe> GetRecipeFromUrl([FromRoute] string url);
}

public class WebScrappingService : IWebScrappingService
{
        private const string RecipeNodeName = "//script[@type='application/ld+json']";

        public async Task<string> GetRecipeJson([FromRoute] string url)
        {
                try
                {
                        var web = new HtmlWeb();
                        HtmlDocument document = await web.LoadFromWebAsync(url);
                        var recipeJsonElements = document.DocumentNode.SelectNodes(RecipeNodeName);
                        if (recipeJsonElements == null || recipeJsonElements.Count == 0)
                        {
                                throw new Exception($"{url} is an invalid recipe.");
                        }


                        string json = recipeJsonElements.FirstOrDefault().InnerText;
                        if (json.StartsWith("[") && json.EndsWith("]"))
                        {
                                json = json.Trim('[', ']');
                        }
                        return json;

                }
                catch (Exception ex)
                {
                        throw new Exception("Error scraping recipe: " + ex.Message);
                }

        }

        private string GetChildNodeValue(JsonNode jsonNode)
        {
                if (jsonNode is JsonObject)
                {
                        string type = jsonNode["@type"]?.ToString();
                        switch (type)
                        {
                                case "HowToStep":
                                        return jsonNode["text"].ToString();
                                case "ImageObject":
                                        return jsonNode["url"].ToString();
                                case "Person":
                                        return jsonNode["name"].ToString();
                                case "Organization":
                                        return jsonNode["name"].ToString();
                                default:
                                        return jsonNode.ToString();
                        }

                }
                else
                {
                        return jsonNode.ToString();
                }

        }

        private List<string> ParseJsonNode(JsonNode parentNode)
        {
                List<string> listOfString = new List<string>();
                if (parentNode == null) return listOfString;


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

        public async Task<Recipe> GetRecipeFromUrl([FromRoute] string url)
        {
                string json = await GetRecipeJson(url);
                JsonNode recipeNode = JsonNode.Parse(json);

                Recipe recipe = new Recipe { };

                recipe.Name = recipeNode["name"] != null ? recipeNode["name"]!.ToString() : "";
                recipe.Images = ParseJsonNode(recipeNode["image"]);
                recipe.Author = ParseJsonNode(recipeNode["author"])[0];
                recipe.Url = url;
                recipe.Description = recipeNode["description"] != null ? recipeNode["description"]!.ToString() : "";
                recipe.RecipeCuisine = recipeNode["recipeCuisine"] != null ? recipeNode["recipeCuisine"]!.ToString() : "";
                recipe.PrepTime = recipeNode["prepTime"] != null ? recipeNode["prepTime"]!.ToString() : "";
                recipe.CookTime = recipeNode["cookTime"] != null ? recipeNode["cookTime"]!.ToString() : "";
                recipe.TotalTime = recipeNode["totalTime"] != null ? recipeNode["totalTime"]!.ToString() : "";
                recipe.Keywords = recipeNode["keywords"] != null ? recipeNode["keywords"]!.ToString() : "";
                recipe.RecipeYield = recipeNode["recipeYield"] != null ? recipeNode["recipeYield"]!.ToString() : "";
                recipe.RecipeCategory = recipeNode["recipecategory"] != null ? recipeNode["recipecategory"]!.ToString() : "";
                recipe.RecipeIngredient = ParseJsonNode(recipeNode["recipeIngredient"]);
                recipe.RecipeInstructions = ParseJsonNode(recipeNode["recipeInstructions"]);




                return recipe;
        }

}



