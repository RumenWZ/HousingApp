using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Extensions;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyTypeController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public PropertyTypeController(
            IUnitOfWork uow,
            IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var propertyTypes = await uow.PropertyTypeRepository.GetAllAsync();
            var propertyTypesDTO = mapper.Map<IEnumerable<KeyValuePairDTO>>(propertyTypes);
            return Ok(propertyTypesDTO);
        }
        
        [HttpPost("add/{propertyType}")]
        [Authorize]
        public async Task<IActionResult> Add(string propertyType)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user.IsAdmin == false)
            {
                return Unauthorized("You do not have permission to perform this action");
            }
            uow.PropertyTypeRepository.Add(propertyType, user.Id);
            await uow.SaveAsync();
            return Ok(201);
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
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
