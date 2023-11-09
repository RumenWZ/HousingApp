using WebAPI.Models;

namespace WebAPI.DTOs.PropertyDTOs
{
    public class UpdatePropertyPhotosDTO
    {
        public List<NewPropertyPhotoDTO> NewPhotos { get; set; }
        public List<OldPropertyPhotoDTO> OldPhotos { get; set; }
    }

    public class NewPropertyPhotoDTO
    {
        public IFormFile File { get; set; }
        public int Index { get; set; }
    }

    public class OldPropertyPhotoDTO
    {
        public Photo Photo { get; set; }
        public int Index { get; set; }
    }
}
