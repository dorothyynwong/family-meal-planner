using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using FamilyMealPlanner.Services;
using FluentAssertions;
using NLog;


[TestFixture]
public class ImageServiceTests
{
    private IImageService _imageService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [SetUp]
    public void SetUp()
    {

        var configurationBuilder = new ConfigurationBuilder()
                                .AddEnvironmentVariables()
                                .Build();

        _imageService = new ImageService(configurationBuilder);
    }

    [Test]
    public async Task UploadImageAsync_ShouldReturnImageUrl_WhenFileIsUploaded()
    {
        var fileName = "image_upload_test.jpg";
        // var imagePath = Path.Combine(Directory.GetCurrentDirectory(), @"..\..\..\Resources", fileName);
        var imagePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Resources", fileName);
        if (!File.Exists(imagePath))
        {
            Logger.Error("Image file not found: " + imagePath);
            throw new FileNotFoundException("The specified image file does not exist.");
        }

        var imageBytes = await File.ReadAllBytesAsync(imagePath);
        var memoryStream = new MemoryStream(imageBytes);
        var mockFormFile = new Mock<IFormFile>();

        mockFormFile.Setup(_ => _.OpenReadStream()).Returns(memoryStream);
        mockFormFile.Setup(_ => _.FileName).Returns(fileName);
        mockFormFile.Setup(_ => _.Length).Returns(memoryStream.Length);
        mockFormFile.Setup(_ => _.ContentType).Returns("image/jpeg");
        mockFormFile.Setup(_ => _.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
                    .Callback<Stream, CancellationToken>((stream, token) =>
                    {
                        memoryStream.CopyTo(stream);
                    })
                    .Returns(Task.CompletedTask);

        var result = await _imageService.UploadImageAsync(mockFormFile.Object);



        result.Should().NotBeNull();
        result.Should().Contain("https:");
    }

    [Test]
    public async Task UploadImageAsync_ShouldReturnExceptions_WhenInvalidFileIsUploaded()
    {
        var fileName = "schoolmenu.pdf";
        // var imagePath = Path.Combine(Directory.GetCurrentDirectory(), @"..\..\..\Resources", fileName);
        var imagePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Resources", fileName);

        if (!File.Exists(imagePath))
        {
            Logger.Error("Image file not found: " + imagePath);
            throw new FileNotFoundException("The specified image file does not exist.");
        }

        var imageBytes = await File.ReadAllBytesAsync(imagePath);
        var memoryStream = new MemoryStream(imageBytes);
        var mockFormFile = new Mock<IFormFile>();

        mockFormFile.Setup(_ => _.OpenReadStream()).Returns(memoryStream);
        mockFormFile.Setup(_ => _.FileName).Returns(fileName);
        mockFormFile.Setup(_ => _.Length).Returns(memoryStream.Length);
        mockFormFile.Setup(_ => _.ContentType).Returns("application/pdf"); 
        mockFormFile.Setup(_ => _.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
                    .Callback<Stream, CancellationToken>((stream, token) =>
                    {
                        memoryStream.CopyTo(stream);
                    })
                    .Returns(Task.CompletedTask);

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _imageService.UploadImageAsync(mockFormFile.Object);
        });

        Assert.That(exception.Message, Is.EqualTo("There was a problem uploading the image. Please try again later."));
    }


}
