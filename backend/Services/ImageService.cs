
using System.Text.Json;
using NLog;

public interface IImageService
{
    Task<string> UploadImageAsync();

}

public class ImageService(IConfiguration configuration) : IImageService
{
    private readonly IConfiguration _configuration = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<string> UploadImageAsync()
    {
        var imgurClientId = _configuration["Imgur:ClientId"];
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.imgur.com/3/image");
        request.Headers.Add("Authorization", $"Client-ID {{{imgurClientId}}}");
        var content = new MultipartFormDataContent
        {
            { new StreamContent(File.OpenRead("C:\\Images\\test.jpg")), "image", "C:\\Images\\test.jpg" },
            { new StringContent("image"), "type" },
            { new StringContent("Simple upload"), "title" },
            { new StringContent("This is a simple image upload in Imgur"), "description" }
        };
        request.Content = content;
        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        var responseStr = await response.Content.ReadAsStringAsync();
        
        Logger.Info(responseStr);
        return responseStr;
    }
}