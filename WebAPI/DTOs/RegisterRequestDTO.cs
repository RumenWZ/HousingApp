﻿using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class RegisterRequestDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Password { get; set; }
        
    }
}
