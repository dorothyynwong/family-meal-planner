using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;

namespace FamilyMealPlanner.Services;

public interface IWebScrappingService
{
        Task<string> GetRecipeJson(string url);
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
}



