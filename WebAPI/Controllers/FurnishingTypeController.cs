using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Extensions;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FurnishingTypeController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public FurnishingTypeController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpPost("add/{furnishingType}")]
        public async Task<IActionResult> Add(string furnishingType)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return Unauthorized("Invalid token");
            }
            if (user.IsAdmin == false)
            {
                return Unauthorized("You do not have permission to add furnishing types");
            }
            uow.FurnishingTypeRepository.Add(furnishingType, user.Id);
            await uow.SaveAsync();
            return Ok(201);
        }
    }
}
