﻿using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User> Authenticate(string username, string password);

        void Register(string username, string password, string mobile, string email);

        Task<bool> UserAlreadyExists(string username);

        Task<User> GetUserByTokenAsync(string token);
        Task<User> GetUserByIdAsync(int id);
        Task<bool> CheckIfEmailIsTakenAsync(string email);
        bool IsPasswordValid(string passwordText, byte[] password, byte[] passwordKey);
    }
}
