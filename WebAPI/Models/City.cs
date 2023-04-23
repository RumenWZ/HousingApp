using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class City : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;
        
    }
}
