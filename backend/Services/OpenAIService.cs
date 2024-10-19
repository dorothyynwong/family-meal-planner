using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IOpenAIService
{
    Task<OpenAIResponse> GetModelResponseAsync(string text, int familyId, int userId);
}

public class OpenAIService(IConfiguration configuration, FamilyMealPlannerContext context) : IOpenAIService
{
    private static readonly HttpClient client = new HttpClient();
    private readonly IConfiguration _configure = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
    private readonly FamilyMealPlannerContext _context = context;

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

        try
        {
            return GetFileContent(filePath);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unable to read prompt {ex.Message}");
            throw new InvalidOperationException(filePath, ex);
        }
    }

    public async Task<OpenAIResponse> GetModelResponseAsync(string text, int familyId, int userId)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configure["OpenAI:API_KEY"]);
        
        string prompt = GetPrompt() + text;

        var requestBody = new
        {
            model = "gpt-3.5-turbo-1106",
            messages = new[] { new { role = "user", content = prompt } },
            max_tokens = 2000
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
        // if (response.IsSuccessStatusCode)
        // {
            // var responseBody = await response.Content.ReadAsStringAsync();
            // Logger.Info("Response from OpenAI:");
            // Logger.Info(responseBody);

            // var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(responseBody);

            /**Test Code**/
            string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\Resources\test.txt");
            var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(GetFileContent(filePath));
            
            return openAIResponse;
        // }
        // else
        //     {
        //         Logger.Error($"Error: {response.StatusCode}");
        //         var errorResponse = await response.Content.ReadAsStringAsync();
        //         Logger.Error($"Error details: {errorResponse}");
        //         throw new Exception(errorResponse);
        //     }
        }

    }