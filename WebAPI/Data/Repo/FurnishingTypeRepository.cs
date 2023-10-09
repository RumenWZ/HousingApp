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
    }
}
