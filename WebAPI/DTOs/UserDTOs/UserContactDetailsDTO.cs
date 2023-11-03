using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.UserDTOs
{
    public class UserContactDetailsDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Mobile { get; set; }
    }
}
