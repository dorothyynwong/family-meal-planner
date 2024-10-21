using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using NLog;

namespace FamilyMealPlanner.Services;

public class MockOpenAIService(IConfiguration configuration, FamilyMealPlannerContext context) : IOpenAIService
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
        Logger.Info("Mock OpenAI is being used");

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configure["OpenAI:API_KEY"]);

        string prompt = GetPrompt() + text;

        var requestBody = new
        {
            model = "gpt-3.5-turbo-1106",
            messages = new[] { new { role = "user", content = prompt } },
            max_tokens = 2000
        };

        var json = JsonSerializer.Serialize(requestBody);

        string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\DevResources\test.txt");
        var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(GetFileContent(filePath));

        return openAIResponse;

    }

}