using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Extensions;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyTypeController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public PropertyTypeController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpPost("add/{propertyType}")]
        public async Task<IActionResult> Add(string propertyType)
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
            uow.PropertyTypeRepository.Add(propertyType, user.Id);
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

            var propertyType = await uow.PropertyTypeRepository.GetByIdAsync(id);
            if (propertyType == null)
            {
                return BadRequest("Invalid furnishing type ID");
            }
            await uow.PropertyTypeRepository.DeleteAsync(id);

            return Ok(201);
        }


    }
}
