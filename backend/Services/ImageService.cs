
using System.Text.Json;
using NLog;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file);

}

public class ImageService(IConfiguration configuration) : IImageService
{
    private readonly IConfiguration _configuration = configuration;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        var imgurClientId = _configuration["Imgur:ClientId"];
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.imgur.com/3/image");
        request.Headers.Add("Authorization", $"Client-ID {{{imgurClientId}}}");

        var tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + Path.GetExtension(file.FileName));

        using (var stream = new FileStream(tempFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        Logger.Info("image service 1");

        var content = new MultipartFormDataContent
        {
            // { new StreamContent(File.OpenRead("C:\\Images\\test.jpg")), "image", "C:\\Images\\test.jpg" },
            { new StreamContent(File.OpenRead(tempFilePath)), "image", Path.GetFileName(tempFilePath) },
            { new StringContent("image"), "type" },
            { new StringContent("Simple upload"), "title" },
            { new StringContent("This is a simple image upload in Imgur"), "description" }
        };

        request.Content = content;
        var response = await client.SendAsync(request);
        Logger.Info("upload end");
        Logger.Info(response.Headers.ToString());
        Logger.Info(response.StatusCode);
        response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        var responseStr = await response.Content.ReadAsStringAsync();

        return responseStr;

    }

}