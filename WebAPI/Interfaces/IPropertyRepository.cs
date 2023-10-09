using WebAPI.DTOs;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<PropertyDTO>> GetAllPropertiesAsync();
        Task<Property> AddProperty(PropertyDTO property, User poster);
        Task<Property> GetPropertyByIdAsync(int id);
    }
}
