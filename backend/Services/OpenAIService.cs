using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using FamilyMealPlanner.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using NLog;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;


namespace FamilyMealPlanner.Services;

public class OpenAIResponse
{
    public string GeneratedText { get; set; }
}

public class OpenAIRequest
{
    public string inputs { get; set; }
}

public class OpenAIService(IConfiguration configuration) : IAIService
{
    private static readonly HttpClient client = new HttpClient();
    private readonly IConfiguration _configure = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<string> GetModelResponseAsync(string text)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configure["OpenAI:API_KEY"]);

             var requestBody = new
        {
            model = "gpt-3.5-turbo-1106", // Specify the model you want to use
            messages = new[]
            {
                new { role = "user", content = text}
            },
            max_tokens = 1000 // Set a limit on the number of tokens in the response
        };

        // Serialize the request body to JSON using System.Text.Json
        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Send the request
        var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
        
        if (response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Response from OpenAI:");
            Console.WriteLine(responseBody);
            return responseBody;
        }
        else
        {
            Console.WriteLine($"Error: {response.StatusCode}");
            var errorResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Error details: {errorResponse}");
            return errorResponse;
        }

    }
}