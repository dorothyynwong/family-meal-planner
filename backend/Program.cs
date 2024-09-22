using FamilyMealPlanner;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.Text.Json.Serialization;
using FamilyMealPlanner.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<IWebScrappingService, WebScrappingService>();

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