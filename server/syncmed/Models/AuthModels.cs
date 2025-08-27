using System.ComponentModel.DataAnnotations;

namespace syncmed.Models
{
    public class LoginRequest
    {
        [Required, EmailAddress] public string Email { get; set; } = default!;
        [Required] public string Password { get; set; } = default!;
    }

    public class RefreshRequest
    {
        [Required] public string RefreshToken { get; set; } = default!;
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; } = default!;
        public DateTime AccessTokenExpiresAt { get; set; }
        public string RefreshToken { get; set; } = default!;
        public DateTime RefreshTokenExpiresAt { get; set; }
        public object User { get; set; } = default!;
    }
}
