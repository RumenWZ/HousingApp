using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    [Table("Photos")]
    public class Photo : BaseEntity
    {
        [Required]
        public string PhotoUrl { get; set; }
        [Required]
        public string PublicId { get; set; }
        public bool IsPrimary { get; set; } = false;
        [ForeignKey("Property")]
        public int PropertyId { get; set; }
    }
}