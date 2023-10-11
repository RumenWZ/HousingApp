using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IPropertyTypeRepository
    {
        void Add(string propertyType, int editedBy);
        Task<PropertyType> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }
}
