using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetPropertiesAsync(int sellRent);
        void AddProperty(Property property);
        Task<Property> GetPropertyDetailsAsync(int id);
        Task<Property> GetPropertyByIdAsync(int id);

    }
}
