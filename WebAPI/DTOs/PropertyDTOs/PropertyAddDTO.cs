using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebAPI.Models;

namespace WebAPI.DTOs.PropertyDTOs
{
    public class PropertyAddDTO
    {
        [Required]
        public int SellOrRent { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 4)]
        [RegularExpression("^[a-zA-Z ]+$", ErrorMessage = "Only letters are allowed")]
        public string Name { get; set; }
        [Required]
        public int PropertyTypeId { get; set; }
        [Required]
        public int BHK { get; set; }
        [Required]
        public int FurnishingTypeId { get; set; }
        [Required]
        public int Price { get; set; }
        [Required]
        public int? BuiltArea { get; set; }
        public int? CarpetArea { get; set; }
        public string Address { get; set; }
        public string? Address2 { get; set; }
        [Required]
        public int CityId { get; set; }
        public int? FloorNo { get; set; }
        public int? TotalFloors { get; set; }
        [Required]
        public bool ReadyToMove { get; set; }
        public string? MainEntrance { get; set; }
        public int? Security { get; set; }
        public bool? Gated { get; set; }
        public int? Maintenance { get; set; }
        public DateTime EstPosessionOn { get; set; }
        public int? Age { get; set; }
        public string? Description { get; set; }

    }
}
