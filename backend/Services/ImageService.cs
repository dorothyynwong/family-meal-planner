
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
        var imgbbApiKey = _configuration["ImgBB:API_KEY"];
        if (imgbbApiKey == null || imgbbApiKey == "")
        {
            Logger.Error("API key cannot be found");
            throw new Exception("API key cannot be found");
        }
            

        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.imgbb.com/1/upload");
        var tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + Path.GetExtension(file.FileName));

        using (var stream = new FileStream(tempFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        Logger.Info("upload started");

        var content = new MultipartFormDataContent
        {
            { new StreamContent(File.OpenRead(tempFilePath)), "image", Path.GetFileName(tempFilePath) },
            { new StringContent(imgbbApiKey), "key" }
        };

        request.Content = content;
        var response = await client.SendAsync(request);
        Logger.Info("upload end");
        response.EnsureSuccessStatusCode();
        var responseStr = await response.Content.ReadAsStringAsync();

        return responseStr;

    }

}