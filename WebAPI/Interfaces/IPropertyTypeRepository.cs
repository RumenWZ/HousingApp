using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyTypeRepository
    {
        Task<IEnumerable<PropertyType>> GetAllAsync();
        void Add(string propertyType, int editedBy);
        Task<PropertyType> GetByIdAsync(int id);
        Task DeleteAsync(int id);
        Task<PropertyType> GetByNameAsync(string name);
    }
}
