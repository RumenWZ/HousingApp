﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Extensions;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CityController : ControllerBase
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        public CityController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities()
        {
           
           var cities = await uow.CityRepository.GetCitiesAsync();
           var citiesDto = mapper.Map<IEnumerable<CityDTO>>(cities);

            return Ok(citiesDto);
        }

        [HttpPost("post")]
        [Authorize]
        public async Task<IActionResult> AddCity(CityDTO cityDTO)
        {
            var user = await uow.UserRepository.GetUserByTokenAsync(HttpContext.GetAuthToken());
            if (!user.IsAdmin)
            {
                return BadRequest("You do not have permission to add cities");
            }
            if (await uow.CityRepository.CityAlreadyExists(cityDTO.Name, cityDTO.Country))
            {
                return BadRequest("This city is already in the database");
            }
            var city = mapper.Map<City>(cityDTO);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;

            uow.CityRepository.AddCity(city);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("updateCityName/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityUpdateDTO cityDTO)
        {
            var city = await uow.CityRepository.FindCity(id);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;
            mapper.Map(cityDTO, city);
            await uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCityPatch(int id , JsonPatchDocument<City> cityToPatch)
        {
            var city = await uow.CityRepository.FindCity(id);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;

            cityToPatch.ApplyTo(city, ModelState);
            await uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            uow.CityRepository.DeleteCity(id);
            await uow.SaveAsync();
            return Ok(id);
        }
    }
}
