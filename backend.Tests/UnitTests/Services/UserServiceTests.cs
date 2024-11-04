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
using FamilyMealPlanner.Enums;

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
        var user1 = new User { Email = "user1@abc.com", UserName = "user1@abc.com", Nickname = "user1", AvatarColor="#FFFFFF", AvatarUrl="http://abc.jpg" };
        var user2 = new User { Email = "user2@abc.com", UserName = "user2@abc.com", Nickname = "user2", AvatarColor="#000000", AvatarUrl="http://def.jpg" };
        var user3 = new User { Email = "user3@abc.com", UserName = "user3@abc.com", Nickname = "user3", AvatarColor="#EEEEEE", AvatarUrl="http://ghi.jpg"  };
        var password = "Pa$$word1";

        await _userManager.CreateAsync(user1, password);
        await _userManager.CreateAsync(user2, password);
        await _userManager.CreateAsync(user3, password);

        var initialFamilies = new List<Family>
        {
            new Family { FamilyName = "Family 1"},
            new Family { FamilyName = "Family 2"},
        };

        if (!context.Families.Any())
        {
            context.Families.AddRange(initialFamilies);
            context.SaveChanges();
        }
        var initialFamilyUsers = new List<FamilyUser>
        {
            new FamilyUser { UserId = 1, FamilyId = 1, FamilyRole = FamilyRoleType.Cook },
            new FamilyUser { UserId = 2, FamilyId = 1, FamilyRole = FamilyRoleType.Eater },
        };

        if (!context.FamilyUsers.Any())
        {
            context.FamilyUsers.AddRange(initialFamilyUsers);
            context.SaveChanges();
        }
    }

    [Test]
    public async Task GetUserById_Return_User()
    {
        var user = await _userService.GetUserById(2);
        user.Id.Should().Be(2);
        user.Email.Should().Be("user2@abc.com");
        user.Nickname.Should().Be("user2");
        user.AvatarColor.Should().Be("#000000");
        user.AvatarUrl.Should().Be("http://def.jpg");
    }

    [Test]
    public async Task GetUserByFamilyId_Return_UserResponses()
    {
        var users = await _userService.GetUserByFamilyId(1);
        users.Count.Should().Be(2);
        var user1 = users[0];
        var user2 = users[1];
        user1.Id.Should().Be(1);
        user2.Id.Should().Be(2);
        user1.Email.Should().Be("user1@abc.com");
        user2.Email.Should().Be("user2@abc.com");
        user1.Nickname.Should().Be("user1");
        user2.Nickname.Should().Be("user2");
        user1.AvatarColor.Should().Be("#FFFFFF");
        user2.AvatarColor.Should().Be("#000000");
        user1.AvatarUrl.Should().Be("http://abc.jpg");
        user2.AvatarUrl.Should().Be("http://def.jpg");
    }

    [Test]
    public async Task UpdateUser_ReturnsUser()
    {
        int userId = 1;

        UserUpdateRequest user = new UserUpdateRequest();
        user.Nickname = "user1_updated";

        await _userService.UpdateUser(user, userId);

        var newUser = await _userService.GetUserById(userId);

        newUser.Id.Should().Be(userId);
        newUser.Nickname.Should().Be("user1_updated");
        newUser.AvatarColor.Should().Be("#FFFFFF");
        newUser.AvatarUrl.Should().Be("http://abc.jpg");
        newUser.Email.Should().Be("user1@abc.com");
        newUser.UserName.Should().Be("user1@abc.com");
    }

    [Test]
    public void UpdateNonExistUser()
    {
        int userId = 100;

        UserUpdateRequest user = new UserUpdateRequest();
        user.Nickname = "user1_updated";

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _userService.UpdateUser(user, userId);
        });
    }

    [Test]
    public async Task DeleteUser()
    {
        int userId = 3;

        await _userService.DeleteUser(userId);

        var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _userService.GetUserById(userId);
        });
    }

    [Test]
    public void DeleteNonExistUser()
    {
        int userId = 100;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _userService.DeleteUser(userId);
        });
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
        _userManager.Dispose();
        _roleManager.Dispose();
    }
}
