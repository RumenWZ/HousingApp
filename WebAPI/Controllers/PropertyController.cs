using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using WebAPI.DTOs.PropertyDTOs;
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
        private readonly IPhotoService photoService;

        public PropertyController(
            IUnitOfWork uow,
            IMapper mapper,
            IPhotoService photoService
            )
        {
            this.uow = uow;
            this.mapper = mapper;
            this.photoService = photoService;
        }

        [HttpGet("list/{sellRent}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyList(int sellRent)
        {
            var properties = await uow.PropertyRepository.GetPropertiesAsync(sellRent);
            var propertyListDTO = mapper.Map<IEnumerable<PropertyListDTO>>(properties);
            return Ok(propertyListDTO);
        }

        [HttpGet("details/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyDetails(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(id);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            var propertyDTO = mapper.Map<PropertyDetailDTO>(property);
            return Ok(propertyDTO);
        }

        
        [HttpPost("add-property")]
        [Authorize]
        public async Task<IActionResult> AddPropertyDetails([FromBody] PropertyAddDTO propertyDTO)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);

            var newProperty = mapper.Map<Property>(propertyDTO);
            newProperty.PostedBy = user.Id;
            uow.PropertyRepository.AddProperty(newProperty);
            await uow.SaveAsync();

            return Ok(newProperty.Id);
            
        }

        [HttpPost("add-photos/{propertyId}")]
        [Authorize]
        public async Task<IActionResult> UploadPropertyPhotos(int propertyId, [FromForm] List<IFormFile> photos)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());

            var property = await uow.PropertyRepository.GetPropertyByIdAsync(propertyId);
            if (property == null)
            {
                return BadRequest("Invalid property id");
            }
            if (property.PostedBy != user.Id)
            {
                return BadRequest("You can not modify other people's properties");
            }

            bool isFirstPhoto = true;

            foreach(var photo in photos)
            {
                if (!photoService.IsImageValidFormat(photo)){
                    return BadRequest($"{photo.FileName} is not a valid format. Supported formats: .jpeg, .png, .jpg");
                }

                if (!photoService.IsImageValidSize(photo, 2 * 1024 * 1024))
                {
                    return BadRequest($"Image size exceeds the maximum allowed size of 2 MB.");
                }

                var uploadResult = await photoService.UploadPhotoAsync(photo);
                var photoUrl = uploadResult.SecureUrl.ToString();

                if (property.Photos == null)
                {
                    property.Photos = new List<Photo>();
                }

                var newPhoto = new Photo
                {
                    PhotoUrl = photoUrl,
                    IsPrimary = isFirstPhoto,
                    PropertyId = property.Id,
                    LastUpdatedBy = user.Id,
                    PublicId = uploadResult.PublicId
                };
                isFirstPhoto = false;
                property.Photos.Add(newPhoto);
                await uow.SaveAsync();
            }
            
            return Ok(201);
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(id);
            if (property == null)
            {
                return NotFound("Invalid property id");
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (property.PostedBy != user.Id)
            {
                return BadRequest("This property listing does not belong to you");
            }

            foreach (var photo in property.Photos)
            {
                await photoService.DeletePhotoAsync(photo.PhotoUrl);
            }
            await uow.PropertyRepository.Delete(property.Id); 
            await uow.SaveAsync();

            return Ok(201);
        }
    }
}
