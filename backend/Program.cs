using FamilyMealPlanner;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.Text.Json.Serialization;
using FamilyMealPlanner.Services;
using NLog;
using NLog.Config;
using NLog.Targets;


var builder = WebApplication.CreateBuilder(args);
var imgurClientId = builder.Configuration["Imgur:ClientId"];

NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
string currentDirectory = System.IO.Directory.GetCurrentDirectory();

var config = new LoggingConfiguration();
var target = new FileTarget { FileName = @$"{currentDirectory}\Logs\FamilyMealPlanner.log", Layout = @"${longdate} ${level} - ${logger}: ${message}" };
config.AddTarget("File Logger", target);
config.LoggingRules.Add(new LoggingRule("*", NLog.LogLevel.Debug, target));
LogManager.Configuration = config;

builder.Services.AddTransient<IWebScrappingService, WebScrappingService>();
builder.Services.AddTransient<IRecipeService, RecipeService>();
builder.Services.AddTransient<IImageService, ImageService>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:Frontend"]!).AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddDbContext<FamilyMealPlannerContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"));
});

builder
    .Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<FamilyMealPlannerContext>()
    .AddDefaultTokenProviders();
builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });

var app = builder.Build();

app.MapGet("/", () => imgurClientId);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.MapControllers();
app.Run();