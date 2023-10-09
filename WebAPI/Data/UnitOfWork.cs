using WebAPI.Data.Repo;
using WebAPI.Interfaces;

namespace WebAPI.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dc;
        public UnitOfWork(DataContext dc)
        {
            this.dc = dc;
        }
        public ICityRepository CityRepository => 
            new CityRepository(dc);

        public DataContext Dc { get; }

        public IUserRepository UserRepository => new UserRepository(dc);

        public IPropertyRepository PropertyRepository => new PropertyRepository(dc);

        public IFurnishingTypeRepository FurnishingTypeRepository => new FurnishingTypeRepository(dc);

        public IPropertyTypeRepository PropertyTypeRepository => new PropertyTypeRepository(dc);

        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }
    }
}
