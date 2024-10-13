using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using FamilyMealPlanner.Models;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IOpenAIService
{
    Task<OpenAIResponse> GetModelResponseAsync(string text);
}

public class OpenAIService(IConfiguration configuration) : IOpenAIService
{
    private static readonly HttpClient client = new HttpClient();
    private readonly IConfiguration _configure = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    private string GetFileContent(string filePath)
    {
        try
        {
            return File.ReadAllText(filePath);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unable to read prompt {ex.Message}");
            throw new InvalidOperationException(filePath, ex);
        }
    }

    private string GetPrompt()
    {
        string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\Resources\OpenAIPrompt.txt");
        string prompt = GetFileContent(filePath);

        try
        {
            return File.ReadAllText(filePath);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unable to read prompt {ex.Message}");
            throw new InvalidOperationException(filePath, ex);
        }
    }

 public async Task<OpenAIResponse> GetModelResponseAsync(string text)
{
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configure["OpenAI:API_KEY"]);

    string prompt = GetPrompt() + text;

    var requestBody = new
    {
        model = "gpt-3.5-turbo-1106",
        messages = new[] { new { role = "user", content = prompt } },
        max_tokens = 1000
    };

    var json = JsonSerializer.Serialize(requestBody);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

    if (response.IsSuccessStatusCode)
    {
        var responseBody = await response.Content.ReadAsStringAsync();
        Logger.Info("Response from OpenAI:");
        Logger.Info(responseBody);

        // var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(responseBody);
        string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\Resources\test.txt");
        var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(GetFileContent(filePath));

        var weekMenuJson = openAIResponse.Choices.FirstOrDefault()?.Message.Content;

        if (!string.IsNullOrWhiteSpace(weekMenuJson))
        {
            var weekMenu = JsonSerializer.Deserialize<WeekMenu>(weekMenuJson, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            });

            // Log the details of the week menu
            if (weekMenu != null && weekMenu.Days != null)
            {
                foreach (var dayMenu in weekMenu.Days)
                {
                    Logger.Info(dayMenu.Day);

                    foreach (var schoolMeal in dayMenu.Meals)
                    {
                        Logger.Info($"- {schoolMeal.MealName} (Category: {schoolMeal.Category}, Allergens: {string.Join(", ", schoolMeal.Allergens)})");
                    }
                }
            }
            else
            {
                Logger.Error("Deserialized week menu is null.");
            }
        }
        else
        {
            Logger.Error("Week menu content is null or empty.");
        }

        return openAIResponse;
    }
    else
    {
        Logger.Error($"Error: {response.StatusCode}");
        var errorResponse = await response.Content.ReadAsStringAsync();
        Logger.Error($"Error details: {errorResponse}");
        throw new Exception(errorResponse);
    }
}

}