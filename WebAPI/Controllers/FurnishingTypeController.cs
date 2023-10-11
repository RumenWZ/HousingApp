using Microsoft.AspNetCore.Authentication;
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
                return BadRequest("Invalid token");
            }
            if (user.IsAdmin == false)
            {
                return Unauthorized("You do not have permission to perform this action");
            }
            uow.FurnishingTypeRepository.Add(furnishingType, user.Id);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (user == null)
            {
                return BadRequest("Invalid token");
            }
            if (user.IsAdmin == false)
            {
                return Unauthorized("You do not have permission to perform this action");
            }

            var furnishingType = await uow.FurnishingTypeRepository.GetByIdAsync(id);
            if (furnishingType == null)
            {
                return BadRequest("Invalid furnishing type ID");
            }
            await uow.FurnishingTypeRepository.DeleteAsync(id);
            
            return Ok(201);
        }
    }
}
