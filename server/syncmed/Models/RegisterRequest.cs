using System.ComponentModel.DataAnnotations;

namespace syncmed.Models
{
    public class RegisterRequest
    {
        [Required, EmailAddress] public string Email { get; set; } = default!;
        [Required, MinLength(8)] public string Password { get; set; } = default!;
        public string? Role { get; set; }
    }
}
