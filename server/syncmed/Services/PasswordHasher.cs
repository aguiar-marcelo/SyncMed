using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace syncmed.Services
{
    public static class PasswordHasher
    {
        public static (byte[] hash, byte[] salt) Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(16);
            var hash = KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100_000,
                numBytesRequested: 32);
            return (hash, salt);
        }

        public static bool Verify(string password, byte[] hash, byte[] salt)
        {
            var test = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 100_000, 32);
            return CryptographicOperations.FixedTimeEquals(test, hash);
        }

        public static string GenerateRefreshToken(int bytes = 32)
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(bytes));
        }
    }
}
