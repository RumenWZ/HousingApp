using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class CityDTO
    {
        public int Id { get; set; }
        [Required]
        [StringLength(30, MinimumLength = 4)]
        [RegularExpression("^[a-zA-Z\\s]+$", ErrorMessage = "Only letters are allowed")]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; }
    }
}
