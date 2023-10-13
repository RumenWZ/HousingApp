using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IFurnishingTypeRepository
    {
        Task<IEnumerable<FurnishingType>> GetAllAsync();
        void Add(string furnishingType, int editedBy);
        Task<FurnishingType> GetByIdAsync(int id);
        Task DeleteAsync(int id);
        Task<FurnishingType> GetByNameAsync(string name);
    }
}
