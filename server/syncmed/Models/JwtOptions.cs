namespace syncmed.Models
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = default!;
        public string Audience { get; set; } = default!;
        public string Secret { get; set; } = default!;
        public int AccessTokenExpiresMinutes { get; set; } = 30;
        public int RefreshTokenExpiresDays { get; set; } = 7;
    }
}
