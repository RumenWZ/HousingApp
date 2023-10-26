using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class UserDetailsDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Mobile { get; set; }
        public ICollection<PropertyListDTO> Properties { get; set; }
    }
}
