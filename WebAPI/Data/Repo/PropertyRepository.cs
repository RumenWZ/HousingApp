using Microsoft.EntityFrameworkCore;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext dc;

        public PropertyRepository(DataContext dc)
        {
            this.dc = dc;
        }
        public async Task<Property> AddProperty(PropertyDTO property, User poster)
        {
            var newProperty = new Property
            {
                SellOrRent = property.SellOrRent,
                Name = property.Name,
                PropertyTypeId = property.PropertyTypeId,
                BHK = property.BHK,
                FurnishingTypeId = property.FurnishingTypeId,
                Price = property.Price,
                BuiltArea = property.BuiltArea,
                CarpetArea = property.CarpetArea,
                Address = property.Address,
                Address2 = property.Address2,
                CityId = property.CityId,
                FloorNo = property.FloorNo,
                TotalFloors = property.TotalFloors,
                ReadyToMove = property.ReadyToMove,
                MainEntrance = property.MainEntrance,
                Security = property.Security,
                Gated = property.Gated,
                Maintenance = property.Maintenance,
                EstPosessionOn = property.EstPosessionOn,
                Age = property.Age,
                Description = property.Description,
                PostedOn = property.PostedOn,
                PostedBy = poster.Id
            };

            dc.Properties.Add(newProperty);
            return await Task.FromResult(newProperty);
        }

        public Task<IEnumerable<PropertyDTO>> GetAllPropertiesAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Property> GetPropertyByIdAsync(int id)
        {
            var property = await dc.Properties.FirstOrDefaultAsync(property => property.Id == id);
            return property;
        }
    }
}
