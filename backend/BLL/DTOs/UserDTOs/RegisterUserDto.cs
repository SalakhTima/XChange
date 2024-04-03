﻿using System.ComponentModel.DataAnnotations;

namespace XChange.BLL.DTOs.UserDTOs;

public class RegisterUserDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Name field length must be in range [3, 50].")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Surname is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Surname field length must be in range [3, 50].")]
    public string Surname { get; set; } = null!;

    [Required(ErrorMessage = "Age is required.")]
    [Range(18, 125, ErrorMessage = "Age field must be in range [18, 125].")]
    public int Age { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [StringLength(40, MinimumLength = 10, ErrorMessage = "Email field length must be in range [10, 40].")]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(60, MinimumLength = 12, ErrorMessage = "Password field length must be in range [12, 60].")]
    public string Password { get; set; } = null!;
}
