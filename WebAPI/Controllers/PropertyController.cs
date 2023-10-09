using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using WebAPI.DTOs;
using WebAPI.Extensions;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IUnitOfWork uow;

        public PropertyController(
            IUnitOfWork uow
            )
        {
            this.uow = uow;
        }

        //[HttpGet]
        //public Task<IActionResult> GetProperties()
        //{
        //    var properties = uow.PropertyRepository.GetAllProperties();
        //    return Ok(properties);
        //}
        [HttpPost("add/property")]
        public async Task<IActionResult> AddPropertyDetails([FromBody] PropertyDTO property)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return Unauthorized("Invalid token");
            }

            var newProperty = await uow.PropertyRepository.AddProperty(property, user);
            await uow.SaveAsync();

            return Ok(newProperty.Id);
            
        }

        [HttpPost("add/photos")]
        public async Task<IActionResult> UploadPropertyPhotos(int propertyId, [FromForm] List<IFormFile> photos)
        {

            return Ok();
        }
    }
}
