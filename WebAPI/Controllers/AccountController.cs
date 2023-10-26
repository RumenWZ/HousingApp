using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Unicode;
using WebAPI.DTOs;
using WebAPI.Errors;
using WebAPI.Extensions;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public AccountController(
            IUnitOfWork uow,
            IConfiguration config,
            IMapper mapper)

        {
            this.uow = uow;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequestDTO loginRequest)
        {
            var user = await uow.UserRepository.Authenticate(loginRequest.UserName, loginRequest.Password);

            ApiError apiError = new ApiError();

            if (user == null)
            {
                return BadRequest("Invalid username or password");
            }

            var loginResponse = new LoginResponseDTO();
            loginResponse.UserName = user.Username;
            loginResponse.Token = CreateJWT(user);

            return Ok(loginResponse);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequestDTO registerRequest)
        {

            if (String.IsNullOrEmpty(registerRequest.UserName.Trim()) || 
                String.IsNullOrEmpty(registerRequest.Password.Trim())) {
                return BadRequest("Username or Password can not be blank");
            }

            
            if (await uow.UserRepository.UserAlreadyExists(registerRequest.UserName))
            {
                return BadRequest("User already exists, try a different username");
            }
            uow.UserRepository.Register(registerRequest.UserName, registerRequest.Password, registerRequest.Mobile, registerRequest.Email);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet("profile-details")]
        [Authorize]
        public async Task<IActionResult> GetUserProfileDetails()
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            var userDTO = mapper.Map<UserDetailsDTO>(user);

            var userProperties = await uow.PropertyRepository.GetPropertieOfUserAsync(user.Id);
            var userPropertiesDTO = mapper.Map<IEnumerable<PropertyListDTO>>(userProperties);

            userDTO.Properties = userPropertiesDTO.ToList();

            return Ok(userDTO);
        }

        private string CreateJWT(User user)
        {
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var signInCredentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = signInCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
