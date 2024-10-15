using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using FamilyMealPlanner.Services;
using FamilyMealPlanner;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Models;

[TestFixture]
public class UserServiceTests
{
    private IUserService _userService;
    private FamilyMealPlannerContext _context;
    private UserManager<User> _userManager;
    private RoleManager<Role> _roleManager;

    [SetUp]
    public void Setup()
    {
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddDbContext<FamilyMealPlannerContext>(options =>
            options.UseInMemoryDatabase("TestDatabase"));

        serviceCollection.AddIdentity<User, Role>()
            .AddEntityFrameworkStores<FamilyMealPlannerContext>()
            .AddDefaultTokenProviders();

        var mockUserManagerLogger = new Mock<ILogger<UserManager<User>>>();
        var mockRoleManagerLogger = new Mock<ILogger<RoleManager<Role>>>();
        var mockDataProtectorTokenProviderLogger = new Mock<ILogger<DataProtectorTokenProvider<User>>>();

        serviceCollection.AddSingleton(mockUserManagerLogger.Object);
        serviceCollection.AddSingleton(mockRoleManagerLogger.Object);
        serviceCollection.AddSingleton(mockDataProtectorTokenProviderLogger.Object);

        var serviceProvider = serviceCollection.BuildServiceProvider();
        _context = serviceProvider.GetService<FamilyMealPlannerContext>();
        _userManager = serviceProvider.GetService<UserManager<User>>();
        _roleManager = serviceProvider.GetService<RoleManager<Role>>();

        var builder = new ConfigurationBuilder();
        IConfigurationRoot configuration = builder.Build();

        _userService = new UserService(_context);

        SeedDatabaseAsync(_context).Wait();
    }

    private async Task SeedDatabaseAsync(FamilyMealPlannerContext context)
    {
        var user1 = new User { Email = "user1@abc.com", UserName = "user1@abc.com", Nickname = "user1" };
        var user2 = new User { Email = "user2@abc.com", UserName = "user2@abc.com", Nickname = "user2" };
        var password = "Pa$$word1";

        await _userManager.CreateAsync(user1, password);
        await _userManager.CreateAsync(user2, password);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
        _userManager.Dispose();
        _roleManager.Dispose();
    }

    [Test]
    public async Task GetUserById_Return_User()
    {
        var user = await _userService.GetUserById(1);
        user.Id.Should().Be(1);
        user.Email.Should().Be("user1@abc.com");
        user.Nickname.Should().Be("user1");
    }

    [Test]
    public async Task UpdateUser_ReturnsUser()
    {
        int userId = 1;

        UserUpdateRequest user = new UserUpdateRequest();
        user.Nickname = "user1_updated";
        
        await _userService.UpdateUser(user, userId);

        var newUser= await _userService.GetUserById(userId);

        newUser.Id.Should().Be(userId);
        newUser.Nickname.Should().Be("user1_updated");
        newUser.Email.Should().Be("user1@abc.com");
        newUser.UserName.Should().Be("user1@abc.com");
    }

    [Test]
    public async Task DeleteMeal()
    {
        int userId = 2;

        await _userService.DeleteUser(userId);

        var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _userService.GetUserById(userId);
        });
    }
}
