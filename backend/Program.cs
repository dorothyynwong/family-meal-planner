using FamilyMealPlanner;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.Text.Json.Serialization;
using FamilyMealPlanner.Services;
using NLog;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);
var imgurClientId = builder.Configuration["Imgur:ClientId"];

NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
string currentDirectory = System.IO.Directory.GetCurrentDirectory();
GlobalDiagnosticsContext.Set("configDir", @$"{currentDirectory}\Logs");
Logger = NLog.Web.NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
Logger.Warn("console logging is great");

builder.Services.AddTransient<IWebScrappingService, WebScrappingService>();
builder.Services.AddTransient<IRecipeService, RecipeService>();
builder.Services.AddTransient<IImageService, ImageService>();
builder.Services.AddTransient<IMealService, MealService>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

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