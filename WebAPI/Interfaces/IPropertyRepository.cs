using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<PropertyDTO>> GetAllPropertiesAsync();
        void AddProperty(Property property);
        Task<Property> GetPropertyByIdAsync(int id);
    }
}
