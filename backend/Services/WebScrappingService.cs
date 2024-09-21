using System.Text.Json;
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

                        return recipeJsonElements.FirstOrDefault().InnerText;


                }
                catch (Exception ex)
                {
                        throw new Exception("Error scraping recipe: " + ex.Message);
                }

        }

        private List<string> ParseJsonNode(JsonNode parentNode)
        {
                List<string> listOfString = new List<string>();
                if (parentNode != null)
                {
                        if (parentNode is JsonArray)
                        {
                                foreach (JsonNode childNode in parentNode.AsArray())
                                {
                                        listOfString.Add(childNode!.ToString());
                                }
                        }
                        else
                        {
                                listOfString.Add(parentNode.ToString());
                        }

                }
                return listOfString;
        }

        public async Task<Recipe> GetRecipeFromUrl([FromRoute] string url)
        {
                string json = await GetRecipeJson(url);
                JsonNode recipeNode = JsonNode.Parse(json);

                JsonNode authorNode = recipeNode["author"]!;

                List<string> instructions = new List<string>();
                JsonNode instructionsNode = recipeNode["recipeInstructions"];
                if (instructionsNode != null)
                {
                        if(instructionsNode is JsonArray)
                        {
                                foreach(JsonNode instruction in instructionsNode.AsArray())
                                {
                                        if (instruction is JsonObject instructionObject && instructionObject["@type"]?.ToString() == "HowToStep")
                                        {
                                                instructions.Add(instruction["text"].ToString());
                                        }
                                        else
                                        {
                                                instructions.Add(instruction.ToString());
                                        }
                                        
                                }
                        }
                        else
                        {
                                instructions.Add(instructionsNode.ToString());
                        }
                }


                Recipe recipe = new Recipe
                {
                        Name = recipeNode["name"]!.ToString(),
                        Images = ParseJsonNode(recipeNode["image"]),
                        Author = authorNode["name"] != null ? authorNode["name"]!.ToString() : "",
                        Url = url,
                        Description = recipeNode["description"] != null ? recipeNode["description"]!.ToString() : "",
                        RecipeCuisine = recipeNode["recipeCuisine"] != null ? recipeNode["recipeCuisine"]!.ToString() : "",
                        PrepTime = recipeNode["prepTime"] != null ? recipeNode["prepTime"]!.ToString() : "",
                        CookTime = recipeNode["cookTime"] != null ? recipeNode["cookTime"]!.ToString() : "",
                        TotalTime = recipeNode["totalTime"] != null ? recipeNode["totalTime"]!.ToString() : "",
                        Keywords = ParseJsonNode(recipeNode["keywords"]),
                        RecipeYield = recipeNode["recipeYield"] != null ? recipeNode["recipeYield"]!.ToString() : "",
                        RecipeCategory = recipeNode["recipecategory"] != null ? recipeNode["recipecategory"]!.ToString() : "",
                        RecipeIngredient = ParseJsonNode(recipeNode["recipeIngredient"]),
                        RecipeInstructions = instructions


                };

                return recipe;
        }

}



