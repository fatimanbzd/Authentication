using API.DTOs.Account;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/Account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(JWTService jwtService, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return Unauthorized("Invalid Username or Password");

            if (user.EmailConfirmed == false) return Unauthorized("Please Confirm your email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid Username or Password");

            return CreateApplicationUserDto(user);

        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto register)
        {
            if (await CheckEmailExistsAsync(register.Email)) return BadRequest($"An existing acount is using {register.Email}. please try with another email");

            var usrToAdd = new User
            {
                FirstName = register.FirstName.ToLower(),
                LastName = register.LastName.ToLower(),
                UserName = register.Email.ToLower(),
                Email = register.Email.ToLower(),
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(usrToAdd, register.Password);

            return !result.Succeeded
                ? BadRequest(result.Errors)
                : Ok(new JsonResult(new {title="Account Create", message= "\"you register successfully. you can login\"" }));
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            User user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }

        #region private Helper Methods
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = _jwtService.CreateJWT(user),
            };
        }

        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _signInManager.UserManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }
        #endregion
    }
}
