using AutoMapper;
using WebAPI.DTOs;
using WebAPI.DTOs.PropertyDTOs;
using WebAPI.DTOs.UserDTOs;
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
            CreateMap<Property, PropertyDTO>().ReverseMap();
            CreateMap<Photo, PhotoDTO>();
            CreateMap<User, UserDTO>();

            CreateMap<Property, PropertyListDTO>()
                .ForMember(d => d.FurnishingType, op => op.MapFrom(src => src.FurnishingType.Name))
                .ForMember(d => d.PropertyType, op => op.MapFrom(src => src.PropertyType.Name))
                .ForMember(d => d.City, op => op.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, op => op.MapFrom(src => src.City.Country))
                .ForMember(d => d.Photo, op => op.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsPrimary).PhotoUrl));

            CreateMap<Property, PropertyDetailDTO>()
                .ForMember(d => d.City, op => op.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, op => op.MapFrom(src => src.City.Country))
                .ForMember(d => d.PropertyType, op => op.MapFrom(src => src.PropertyType.Name))
                .ForMember(d => d.FurnishingType, op => op.MapFrom(src => src.FurnishingType.Name));

            CreateMap<FurnishingType, KeyValuePairDTO>();
            CreateMap<PropertyType, KeyValuePairDTO>();
            CreateMap<User, UserDetailsDTO>()
                .ForMember(d => d.Properties, op => op.Ignore());
        }
    }
}
