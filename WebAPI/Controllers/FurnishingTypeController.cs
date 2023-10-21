using AutoMapper;
using Microsoft.AspNetCore.Authentication;
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
    public class FurnishingTypeController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public FurnishingTypeController(
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
            var furnishingTypes = await uow.FurnishingTypeRepository.GetAllAsync();
            var furnishingTypesDTO = mapper.Map<IEnumerable<KeyValuePairDTO>>(furnishingTypes);
            return Ok(furnishingTypesDTO);
        }


        [HttpPost("add/{furnishingType}")]
        [Authorize]
        public async Task<IActionResult> Add(string furnishingType)
        {
            string token = HttpContext.GetAuthToken();
            var user = await uow.UserRepository.GetUserByTokenAsync(token);
            if (user.IsAdmin == false)
            {
                return Unauthorized("You do not have permission to perform this action");
            }
            uow.FurnishingTypeRepository.Add(furnishingType, user.Id);
            await uow.SaveAsync();
            return StatusCode(201);
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

            var furnishingType = await uow.FurnishingTypeRepository.GetByIdAsync(id);
            if (furnishingType == null)
            {
                return BadRequest("Invalid furnishing type ID");
            }
            await uow.FurnishingTypeRepository.DeleteAsync(id);
            
            return StatusCode(201);
        }
    }
}
