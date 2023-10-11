using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using WebAPI.DTOs;
using WebAPI.Extensions;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public PropertyController(
            IUnitOfWork uow,
            IMapper mapper
            )
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProperties()
        {
            var properties = await uow.PropertyRepository.GetAllPropertiesAsync();
            var propertyDTOs = new List<PropertyResponseDTO>();
            foreach ( var property in properties) { 
                var propertyDTO = mapper.Map<PropertyResponseDTO>(property);
                propertyDTOs.Add(propertyDTO);
            }
            return Ok(propertyDTOs);
        }
        [HttpPost("add/property")]
        public async Task<IActionResult> AddPropertyDetails([FromBody] PropertyAddDTO propertyDTO)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user == null)
            {
                return Unauthorized("Invalid token");
            }

            var newProperty = mapper.Map<Property>(propertyDTO);
            newProperty.PostedBy = user.Id;
            uow.PropertyRepository.AddProperty(newProperty);
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
