using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class ChangePasswordRequestDTO
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        [StringLength(64, ErrorMessage = "Password is too long"), 
            MinLength(8, ErrorMessage = "Password must be at least 8 characters")]

        public string NewPassword { get; set; }
    }
}
