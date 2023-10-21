using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext dc;

        public PropertyRepository(
            DataContext dc
            )
        {
            this.dc = dc;
        }
        public async void AddProperty(Property property)
        {
            await dc.Properties.AddAsync(property);
        }

        public async Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent)
        {
            var properties =  await dc.Properties
            .Include(p => p.PropertyType)
            .Include(p => p.City)
            .Include(p => p.FurnishingType)
            .Include(p => p.Photos)
            .Where(p => p.SellOrRent == sellRent)
            .ToListAsync();

            return properties;
        }

        public async Task<Property> GetPropertyByIdAsync(int id)
        {
            var property = await dc.Properties.FirstOrDefaultAsync(property => property.Id == id);
            return property;
        }

        public async Task<Property> GetPropertyDetailsAsync(int id)
        {
            var property = await dc.Properties
                .Include(p => p.PropertyType)
                .Include(p => p.City)
                .Include(p => p.FurnishingType)
                .Include(p => p.Photos)
                .Where(p => p.Id == id)
                .FirstAsync();

            return property;
        }
    }
}
