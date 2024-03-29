﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
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

        [HttpGet("full-details/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFullPropertyDetails(int id)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(id);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            return Ok(property);
        }


        [HttpPost("add-property")]
        [Authorize]
        public async Task<IActionResult> AddPropertyDetails([FromBody] PropertyAddDTO propertyDTO)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            var userProperties = await uow.PropertyRepository.GetPropertieOfUserAsync(user.Id);
            if (userProperties.Count() >= 10)
            {
                return BadRequest("You can not have more than 10 properties listed.");
            }

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

            var index = 0;

            foreach (var photo in photos)
            {
                if (!photoService.IsImageValidFormat(photo))
                {
                    return BadRequest($"{photo.FileName} is not a valid format. Supported formats: .jpeg, .png, .jpg");
                }

                if (!photoService.IsImageValidSize(photo, 2 * 1024 * 1024))
                {
                    return BadRequest($"Image size exceeds the maximum allowed size of 2 MB.");
                }

                using (var image = Image.Load(photo.OpenReadStream()))
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(40, 30)
                    }));

                    using (var memoryStream = new MemoryStream())
                    {
                        image.Save(memoryStream, new PngEncoder());
                        memoryStream.Position = 0;

                        var shrunkenImageStream = new MemoryStream();
                        memoryStream.CopyTo(shrunkenImageStream);
                        shrunkenImageStream.Position = 0;
                        var shrunkenImageFile = new FormFile(shrunkenImageStream, 0, shrunkenImageStream.Length, "shrunkenImage", "shrunkenImage.png");
                        var shrunkenUploadResult = await photoService.UploadPhotoAsync(shrunkenImageFile);

                        var shrunkenPhotoUrl = shrunkenUploadResult.SecureUrl.ToString();

                        var uploadResult = await photoService.UploadPhotoAsync(photo);
                        var originalPhotoUrl = uploadResult.SecureUrl.ToString();

                        if (property.Photos == null)
                        {
                            property.Photos = new List<Photo>();
                        }

                        var newPhoto = new Photo
                        {
                            PhotoUrl = originalPhotoUrl,
                            MiniPhotoUrl = shrunkenPhotoUrl,
                            IsPrimary = index == 0,
                            PropertyId = property.Id,
                            LastUpdatedBy = user.Id,
                            PublicId = uploadResult.PublicId,
                            PhotoIndex = index,
                        };
                        index++;
                        property.Photos.Add(newPhoto);
                        await uow.SaveAsync();
                    }

                }

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
                if (!string.IsNullOrEmpty(photo.PhotoUrl))
                {
                    await photoService.DeletePhotoAsync(photo.PhotoUrl);
                }
                if (!string.IsNullOrEmpty(photo.MiniPhotoUrl))
                {
                    await photoService.DeletePhotoAsync(photo.MiniPhotoUrl);
                }

            }
            await uow.PropertyRepository.Delete(property.Id); 
            await uow.SaveAsync();

            return Ok(201);
        }

        [HttpPatch("update-details/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePropertyDetails(int id, PropertyAddDTO updatedProperty)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(id);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (user.Id != property.PostedBy)
            {
                return BadRequest("This property listing does not belong to you");
            }

            mapper.Map(updatedProperty, property);
            property.LastUpdatedOn = DateTime.Now;
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpPatch("update-photo-index/{propertyId}/{photoId}/{index}")]
        [Authorize]
        public async Task<IActionResult> UpdatePhotoIndex(int propertyId, int photoId, int index)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(propertyId);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (user.Id != property.PostedBy) 
            {
                return BadRequest("This property does not belong to you");
            }
            var photo = property.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null)
            {
                return BadRequest("Photo not found");
            }
            photo.PhotoIndex = index;
            photo.IsPrimary = index == 0;
            property.LastUpdatedOn = DateTime.Now;
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpPost("upload-photo/{propertyId}/{photoIndex}")]
        [Authorize]
        public async Task<IActionResult> UploadPropertyPhoto(int propertyId, int photoIndex, IFormFile photo)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(propertyId);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (user.Id != property.PostedBy)
            {
                return BadRequest("This property does not belong to you");
            }

            if (!photoService.IsImageValidFormat(photo))
            {
                return BadRequest($"{photo.FileName} is not a valid format. Supported formats: .jpeg, .png, .jpg");
            }

            if (!photoService.IsImageValidSize(photo, 2 * 1024 * 1024))
            {
                return BadRequest($"Image size exceeds the maximum allowed size of 2 MB.");
            }

            using (var image = Image.Load(photo.OpenReadStream()))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(40, 30)
                }));

                using (var memoryStream = new MemoryStream())
                {
                    image.Save(memoryStream, new PngEncoder());
                    memoryStream.Position = 0;

                    var shrunkenImageStream = new MemoryStream();
                    memoryStream.CopyTo(shrunkenImageStream);
                    shrunkenImageStream.Position = 0;
                    var shrunkenImageFile = new FormFile(shrunkenImageStream, 0, shrunkenImageStream.Length, "shrunkenImage", "shrunkenImage.png");
                    var shrunkenUploadResult = await photoService.UploadPhotoAsync(shrunkenImageFile);

                    var shrunkenPhotoUrl = shrunkenUploadResult.SecureUrl.ToString();

                    var uploadResult = await photoService.UploadPhotoAsync(photo);
                    var originalPhotoUrl = uploadResult.SecureUrl.ToString();

                    if (property.Photos == null)
                    {
                        property.Photos = new List<Photo>();
                    }

                    var newPhoto = new Photo
                    {
                        PhotoUrl = originalPhotoUrl,
                        MiniPhotoUrl = shrunkenPhotoUrl,
                        IsPrimary = photoIndex == 0,
                        PropertyId = property.Id,
                        LastUpdatedBy = user.Id,
                        PublicId = uploadResult.PublicId,
                        PhotoIndex = photoIndex,
                    };

                    property.Photos.Add(newPhoto);
                    await uow.SaveAsync();
                }
            }
            return Ok(201);
        }

        [HttpDelete("delete-photo/{propertyId}/{photoId}")]
        [Authorize]
        public async Task<IActionResult> DeletePropertyPhoto(int propertyId, int photoId)
        {
            var property = await uow.PropertyRepository.GetPropertyDetailsAsync(propertyId);
            if (property == null)
            {
                return BadRequest("Property not found");
            }
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (user.Id != property.PostedBy)
            {
                return BadRequest("This property does not belong to you");
            }
            var photo = property.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null)
            {
                return BadRequest("Photo not found");
            }
            await photoService.DeletePhotoAsync(photo.PhotoUrl);
            property.Photos.Remove(photo);
            await uow.SaveAsync();
            return Ok(201);
        }

    }
}
