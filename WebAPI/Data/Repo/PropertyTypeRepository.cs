using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class PropertyTypeRepository : IPropertyTypeRepository
    {
        private readonly DataContext dc;

        public PropertyTypeRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public void Add(string propertyType, int editedBy)
        {
            var newPropertyType = new PropertyType
            {
                Name = propertyType,
                LastUpdatedOn = DateTime.Now,
                LastUpdatedBy = editedBy
            };

            dc.PropertyTypes.Add(newPropertyType);
        }

        public async Task DeleteAsync(int id)
        {
            var propertyType = dc.PropertyTypes.FirstOrDefault(pt => pt.Id == id);
            if (propertyType != null)
            {
                dc.PropertyTypes.Remove(propertyType);
                await dc.SaveChangesAsync();
            }
        }

        public async Task<PropertyType> GetByIdAsync(int id)
        {
            var propertyType = await dc.PropertyTypes.FirstOrDefaultAsync(p => p.Id == id);
            return propertyType;
        }
    }
}
