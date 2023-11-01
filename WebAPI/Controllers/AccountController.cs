using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
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

        [HttpGet("user-contact-details/{id}")]
        public async Task<IActionResult> GetUserContactDetails(int id)
        {
            var user = await uow.UserRepository.GetUserByIdAsync(id);
            if (user == null) { return BadRequest("Invalid user id"); }

            var contactDetails = new UserContactDetailsDTO
            {
                Email = user.Email,
                Mobile = user.Mobile
            };
            return Ok(contactDetails);
        }

        [HttpPatch("update-email/{newEmail}")]
        [Authorize]
        public async Task<IActionResult> UpdateEmail(string newEmail)
        {
            var validEmailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+";
            if (!Regex.IsMatch(newEmail, validEmailPattern))
            {
                return BadRequest("Invalid email address");
            }
            if (newEmail.Length > 50)
            {
                return BadRequest("Email is too long");
            }
            if (await uow.UserRepository.CheckIfEmailIsTakenAsync(newEmail))
            {
                return BadRequest("This email is already taken");
            }
            
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            user.Email = newEmail;
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpPatch("update-mobile/{newMobile}")]
        [Authorize]
        public async Task<IActionResult> UpdateMobile(string newMobile)
        {
            var validMobilePattern = @"^\+?\d{9,15}$";
            if (!Regex.IsMatch(newMobile, validMobilePattern))
            {
                return BadRequest("Invalid mobile number");
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            user.Mobile = newMobile;
            await uow.SaveAsync();
            return Ok(201);
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
