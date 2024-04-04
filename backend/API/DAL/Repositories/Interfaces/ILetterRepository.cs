﻿using API.DAL.Models;

namespace API.DAL.Repositories.Interfaces;

public interface ILetterRepository
{
    Task<Letter?> GetByIdAsync(Guid id);
    Task<IQueryable<Letter>> GetAllAsync();
    Task CreateAsync(Letter letter);
    Task DeleteAsync(Letter letter);
}