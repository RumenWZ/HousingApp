using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary cloudinary;
        public PhotoService(IOptions<CloudinarySettings> cloudinaryConfig)
        {
            Account account = new Account(
                cloudinaryConfig.Value.CloudName,
                Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY"),
                Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET")
                );
            cloudinary = new Cloudinary(account);
        }
        public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo)
        {

            var uploadResult = new ImageUploadResult();
            if (photo.Length > 0)
            {
                using var stream = photo.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(photo.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500)
                };
                uploadResult = await cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string imageUrl)
        {
            string publicId = GetPublicIdFromImageUrl(imageUrl);

            var deletionParams = new DeletionParams(publicId);

            DeletionResult deletionResult = await cloudinary.DestroyAsync(deletionParams);

            return deletionResult;
        }

        private string GetPublicIdFromImageUrl(string imageUrl)
        {
            Uri uri = new Uri(imageUrl);
            string publicId = Path.GetFileNameWithoutExtension(uri.AbsolutePath);

            return publicId;
        }

        public bool IsImageValidFormat(IFormFile image)
        {
            {
                var fileExtension = Path.GetExtension(image.FileName)?.ToLowerInvariant();

                return fileExtension switch
                {
                    ".jpeg" => true,
                    ".png" => true,
                    ".jpg" => true,
                    _ => false
                };
            }
        }

        public bool IsImageValidSize(IFormFile image, double maxSizeInBytes)
        {
            return image.Length <= maxSizeInBytes;
        }
    }
}
