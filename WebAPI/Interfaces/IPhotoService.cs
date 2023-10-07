using CloudinaryDotNet.Actions;

namespace WebAPI.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo);

        Task<DeletionResult> DeletePhotoAsync(string imageUrl);

        bool IsImageValidFormat(IFormFile image);

        bool IsImageValidSize(IFormFile image, double maxSizeInBytes);
    }
}
