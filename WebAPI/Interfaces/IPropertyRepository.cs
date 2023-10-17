using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetAllPropertiesAsync();
        void AddProperty(Property property);
        Task<Property> GetPropertyByIdAsync(int id);
    }
}
