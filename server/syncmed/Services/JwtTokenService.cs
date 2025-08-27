using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using syncmed.Entities;
using syncmed.Models;

namespace syncmed.Services
{
    public class JwtTokenService
    {
        private readonly JwtOptions _opt;
        private readonly SigningCredentials _creds;

        public JwtTokenService(IOptions<JwtOptions> opt)
        {
            _opt = opt.Value;
            _creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Secret)),
                SecurityAlgorithms.HmacSha256
            );
        }

        public (string token, DateTime expiresAt) CreateAccessToken(User user)
        {
            var now = DateTime.UtcNow;
            var expires = now.AddMinutes(_opt.AccessTokenExpiresMinutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(ClaimTypes.Role, user.Role ?? "user"),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
            };

            var jwt = new JwtSecurityToken(
                issuer: _opt.Issuer,
                audience: _opt.Audience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: _creds
            );

            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            return (token, expires);
        }

        public (string token, DateTime expiresAt) CreateRefreshToken()
        {
            var token = PasswordHasher.GenerateRefreshToken();
            var expires = DateTime.UtcNow.AddDays(_opt.RefreshTokenExpiresDays);
            return (token, expires);
        }
    }
}
