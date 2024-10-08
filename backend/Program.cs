using FamilyMealPlanner;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.Text.Json.Serialization;
using FamilyMealPlanner.Services;
using NLog;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
string currentDirectory = System.IO.Directory.GetCurrentDirectory();
GlobalDiagnosticsContext.Set("configDir", @$"{currentDirectory}\Logs");
Logger = NLog.Web.NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
Logger.Warn("console logging is great");

builder.Services.AddTransient<IWebScrappingService, WebScrappingService>();
builder.Services.AddTransient<IRecipeService, RecipeService>();
builder.Services.AddTransient<IImageService, ImageService>();
builder.Services.AddTransient<IMealService, MealService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IFamilyService, FamilyService>();
builder.Services.AddTransient<IFamilyUserService, FamilyUserService>();
builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:Frontend"]!).AllowAnyMethod()
                                                                    .AllowAnyHeader()
                                                                    .AllowCredentials();
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

builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    string secret = builder.Configuration["JWT:SECRET"];
                    Logger.Debug(secret);
                    if (secret == null)
                        throw new InvalidOperationException("Unable to find JWT Secret");

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        ValidateLifetime = true,
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(secret)),
                        ValidateIssuerSigningKey = true,
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = ctx =>
                        {
                            ctx.Request.Cookies.TryGetValue("accessToken", out var accessToken);
                            if (!string.IsNullOrEmpty(accessToken))
                                ctx.Token = accessToken;
                            return Task.CompletedTask;
                        }
                    };
                });

builder.Services.AddAuthorization();


builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();