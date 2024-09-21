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

        public async Task<Recipe> GetRecipeFromUrl([FromRoute] string url)
        {
                string json = await GetRecipeJson(url);
                JsonNode recipeNode = JsonNode.Parse(json);
                List<string> images = new List<string>();

                JsonNode imagesNode = recipeNode["image"];
                if (imagesNode != null)
                {
                        if (imagesNode is JsonArray)
                        {
                                foreach (JsonNode image in imagesNode.AsArray())
                                {
                                        images.Add(image!.ToString());
                                }

                        }
                        else
                        {
                                images.Add(imagesNode.ToString());
                        }

                }


                JsonNode authorNode = recipeNode["author"]!;

                List<string> keywords = new List<string>();

                JsonNode keywordsNode = recipeNode["keywords"];
                if (keywordsNode != null)
                {
                        if (keywordsNode is JsonArray)
                        {
                                foreach (JsonNode keyword in keywordsNode.AsArray())
                                {
                                        keywords.Add(keyword!.ToString());
                                }
                        }
                        else
                        {
                                keywords.Add(keywordsNode.ToString());
                        }

                }

                List<string> ingredients = new List<string>();
                JsonNode ingredientsNode = recipeNode["recipeIngredient"];
                if (ingredientsNode != null)
                {
                        if (ingredientsNode is JsonArray)
                        {
                                foreach (JsonNode ingredient in ingredientsNode.AsArray())
                                {
                                        ingredients.Add(ingredient!.ToString());
                                }
                        }
                        else
                        {
                                ingredients.Add(ingredientsNode.ToString());
                        }

                }

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
                        Images = images,
                        Author = authorNode["name"] != null ? authorNode["name"]!.ToString() : "",
                        Url = url,
                        Description = recipeNode["description"] != null ? recipeNode["description"]!.ToString() : "",
                        RecipeCuisine = recipeNode["recipeCuisine"] != null ? recipeNode["recipeCuisine"]!.ToString() : "",
                        PrepTime = recipeNode["prepTime"] != null ? recipeNode["prepTime"]!.ToString() : "",
                        CookTime = recipeNode["cookTime"] != null ? recipeNode["cookTime"]!.ToString() : "",
                        TotalTime = recipeNode["totalTime"] != null ? recipeNode["totalTime"]!.ToString() : "",
                        Keywords = keywords,
                        RecipeYield = recipeNode["recipeYield"] != null ? recipeNode["recipeYield"]!.ToString() : "",
                        RecipeCategory = recipeNode["recipecategory"] != null ? recipeNode["recipecategory"]!.ToString() : "",
                        RecipeIngredient = ingredients,
                        RecipeInstructions = instructions


                };

                return recipe;
        }

}



