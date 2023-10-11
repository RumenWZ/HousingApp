using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IFurnishingTypeRepository
    {
        void Add(string furnishingType, int editedBy);
        Task<FurnishingType> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }
}
