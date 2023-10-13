using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class FurnishingTypeRepository : IFurnishingTypeRepository
    {
        private readonly DataContext dc;

        public FurnishingTypeRepository(DataContext dc)
        {
            this.dc = dc;
        }



        public void Add(string furnishingType, int editedBy)
        {
            var newFurnishingType = new FurnishingType
            {
                Name = furnishingType,
                LastUpdatedOn = DateTime.Now,
                LastUpdatedBy = editedBy
            };

            dc.FurnishingTypes.Add(newFurnishingType);
        }

        public async Task DeleteAsync(int id)
        {
            var furnishingType = dc.FurnishingTypes.FirstOrDefault(ft => ft.Id == id);
            if (furnishingType != null)
            {
                dc.FurnishingTypes.Remove(furnishingType);
                await dc.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<FurnishingType>> GetAllAsync()
        {
            return await dc.FurnishingTypes.ToListAsync();
        }

        public async Task<FurnishingType> GetByIdAsync(int id)
        {                                                
            var furnishingType = await dc.FurnishingTypes.FirstOrDefaultAsync(p => p.Id == id);
            return furnishingType;
        }

        public async Task<FurnishingType> GetByNameAsync(string name)
        {
            var furnishingType = await dc.FurnishingTypes.FirstOrDefaultAsync(ft => ft.Name == name);
            return furnishingType;
        }
    }
}
