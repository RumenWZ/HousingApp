﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext dc;

        public PropertyRepository(
            DataContext dc
            )
        {
            this.dc = dc;
        }
        public async void AddProperty(Property property)
        {
            await dc.Properties.AddAsync(property);
        }

        public Task<IEnumerable<PropertyDTO>> GetAllPropertiesAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Property> GetPropertyByIdAsync(int id)
        {
            var property = await dc.Properties.FirstOrDefaultAsync(property => property.Id == id);
            return property;
        }
    }
}