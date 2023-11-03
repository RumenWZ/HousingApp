﻿using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs.UserDTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Mobile { get; set; }
    }
}
