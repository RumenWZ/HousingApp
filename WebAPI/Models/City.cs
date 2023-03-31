﻿using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class City
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; }
        public DateTime LastUpdatedOn { get; set; }

        public int LastUpdatedBy { get; set; }
    }
}