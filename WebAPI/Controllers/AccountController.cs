using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        public AccountController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO loginRequest)
        {
            var user = await uow.UserRepository.Authenticate(loginRequest.UserName, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized();
            }

            var loginResponse = new LoginResponseDTO();
            loginResponse.UserName = user.Username;
            loginResponse.Token = "add token later";

            return Ok(loginResponse);
        }
    }
}
