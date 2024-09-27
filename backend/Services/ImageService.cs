
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
            Logger.Error("ImgBB API key cannot be found or is invalid.");
            throw new InvalidOperationException("ImgBB API key cannot be found or is invalid.");
        }

        var tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + Path.GetExtension(file.FileName));

        try
        {
            using (var stream = new FileStream(tempFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            Logger.Info("upload started");

            using (var client = new HttpClient())
            {
                using (var request = new HttpRequestMessage(HttpMethod.Post, "https://api.imgbb.com/1/upload"))
                {
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

        }
        catch (HttpRequestException ex)
        {
            Logger.Error($"HTTP Request error: {ex.Message}");
            throw new Exception("There was a problem uploading the image. Please try again later.", ex);
        }
        catch (IOException ex)
        {
            Logger.Error($"File error: {ex.Message}");
            throw new IOException("An error occurred while processing the image file.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error, unable to upload image to ImgBB: {ex.Message}");
            throw new Exception($"Unable to upload image to ImgBB, {ex.Message}", ex);
        }
        finally
        {
            try
            {
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
            }
            catch (Exception ex)
            {
                Logger.Error($"Unexpected error, unable to remove temporary file: {ex.Message}");
            }
        }

    }

}