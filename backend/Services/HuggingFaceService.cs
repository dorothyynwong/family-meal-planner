using System.Net.Http.Headers;
using System.Text;
using FamilyMealPlanner.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using NLog;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;


namespace FamilyMealPlanner.Services;

public class HuggingFaceResponse
{
    public string GeneratedText { get; set; }
}

public class HuggingFaceRequest
{
    public string inputs { get; set; }
}

public interface IAIService
{
    Task<string> GetModelResponseAsync(string text);
}

public class HuggingFaceService(IConfiguration configuration) : IAIService
{
    private static readonly HttpClient client = new HttpClient();
    private readonly IConfiguration _configure = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<string> GetModelResponseAsync(string text)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configure["HuggingFace:API_KEY"]);

        var request = new HuggingFaceRequest
        {
            inputs = $"Parse the following school menu text into a structured JSON format:\n{text}"
        };

        var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

        var response = await client.PostAsync("https://api-inference.huggingface.co/models/gpt2", content);
        if (!response.IsSuccessStatusCode)
        {
            var errorDetails = await response.Content.ReadAsStringAsync();
            Logger.Error(errorDetails);
        }


        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();

        return responseBody;

        // var modelResponse = System.Text.Json.JsonSerializer.Deserialize<HuggingFaceResponse>(responseBody);
        // return modelResponse;
    }
}