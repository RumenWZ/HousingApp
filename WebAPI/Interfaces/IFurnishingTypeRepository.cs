namespace WebAPI.Interfaces
{
    public interface IFurnishingTypeRepository
    {
        void Add(string furnishingType, int editedBy);
    }
}
