﻿using AutoMapper;
using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<City, CityDTO>().ReverseMap();
            CreateMap<City, CityUpdateDTO>().ReverseMap();
            CreateMap<Property, PropertyAddDTO>().ReverseMap();
            CreateMap<PropertyAddDTO, Property>().ReverseMap();
            CreateMap<Property, PropertyResponseDTO>().ReverseMap();
            
            CreateMap<FurnishingType, KeyValuePairDTO>();
            CreateMap<PropertyType, KeyValuePairDTO>();
        }
    }
}
