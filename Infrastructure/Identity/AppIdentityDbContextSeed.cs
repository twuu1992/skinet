using System.Linq;
using System.Threading.Tasks;
using Core.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserData(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "User One",
                    Email = "UserOne@test.com",
                    UserName = "UserOne@test.com",
                    FirstName = "User",
                    LastName = "One",
                    Address = new Address
                    {
                        Street = "10 Demo Street",
                        City = "Southbank",
                        State = "VIC",
                        Postcode = "3006"
                    }
                };

                await userManager.CreateAsync(user, "@Bcd1234");
            }
        }
    }
}