using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using syncmed.Entities;
using syncmed.Models;
using syncmed.Services;

namespace syncmed.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly JwtTokenService _tokens;

        public AuthController(IConfiguration configuration, JwtTokenService tokens)
        {
            _connectionString = configuration.GetConnectionString("syncmed");
            _tokens = tokens;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var email = req.Email.Trim().ToLowerInvariant();

            const string EXISTS = "SELECT 1 FROM dbo.[users] WHERE email = @Email;";
            const string INS = @"
                INSERT INTO dbo.[users] (email, password_hash, password_salt, role)
                VALUES (@Email, @Hash, @Salt, 'user');
                SELECT CAST(SCOPE_IDENTITY() AS int);";
                    const string SEL = @"SELECT id AS Id, email AS Email, role AS Role FROM dbo.[users] WHERE id = @Id;";

            await using var db = new SqlConnection(_connectionString);

            var exists = await db.ExecuteScalarAsync<int?>(EXISTS, new { Email = email });
            if (exists.HasValue) return Conflict(new { error = "Email already registered." });

            var (hash, salt) = PasswordHasher.Hash(req.Password);

            try
            {
                var newId = await db.ExecuteScalarAsync<int>(INS, new
                {
                    Email = email,
                    Hash = hash,
                    Salt = salt,
                    Role = "user"
                });

                var created = await db.QuerySingleAsync<dynamic>(SEL, new { Id = newId });

                return Created($"/api/users/{newId}", created);
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601) 
            {
                return Conflict(new { error = "Email already registered." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            const string GET_USER = @"
                SELECT
                    id               AS Id,
                    email            AS Email,
                    password_hash    AS Password_Hash,
                    password_salt    AS Password_Salt,
                    role             AS Role,
                    refresh_token    AS Refresh_Token,
                    refresh_token_expires AS Refresh_Token_Expires
                FROM dbo.[users]
                WHERE email = @Email;";

            await using var db = new SqlConnection(_connectionString);
            var user = await db.QuerySingleOrDefaultAsync<User>(GET_USER, new { req.Email });
            if (user is null)
                return Unauthorized(new { error = "Invalid credentials" });

            if (!Services.PasswordHasher.Verify(req.Password, user.Password_Hash, user.Password_Salt))
                return Unauthorized(new { error = "Invalid credentials" });

            var (access, accessExp) = _tokens.CreateAccessToken(user);
            var (refresh, refreshExp) = _tokens.CreateRefreshToken();

            const string SAVE_REFRESH = @"
                UPDATE dbo.[users]
                SET refresh_token = @RefreshToken,
                    refresh_token_expires = @RefreshExpires,
                    updated_at = SYSUTCDATETIME()
                WHERE id = @Id;";

            await db.ExecuteAsync(SAVE_REFRESH, new { RefreshToken = refresh, RefreshExpires = refreshExp, user.Id });

            return Ok(new AuthResponse
            {
                AccessToken = access,
                AccessTokenExpiresAt = accessExp,
                RefreshToken = refresh,
                RefreshTokenExpiresAt = refreshExp,
                User = new { id = user.Id, email = user.Email, role = user.Role }
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            const string GET_BY_REFRESH = @"
                SELECT
                    id               AS Id,
                    email            AS Email,
                    password_hash    AS Password_Hash,
                    password_salt    AS Password_Salt,
                    role             AS Role,
                    refresh_token    AS Refresh_Token,
                    refresh_token_expires AS Refresh_Token_Expires
                FROM dbo.[users]
                WHERE refresh_token = @RefreshToken;";

            await using var db = new SqlConnection(_connectionString);
            var user = await db.QuerySingleOrDefaultAsync<User>(GET_BY_REFRESH, new { req.RefreshToken });

            if (user is null || user.Refresh_Token_Expires is null || user.Refresh_Token_Expires <= DateTime.UtcNow)
                return Unauthorized(new { error = "Invalid or expired refresh token" });

            // rotate tokens
            var (access, accessExp) = _tokens.CreateAccessToken(user);
            var (refresh, refreshExp) = _tokens.CreateRefreshToken();

            const string SAVE_REFRESH = @"
                UPDATE dbo.[users]
                SET refresh_token = @RefreshToken,
                    refresh_token_expires = @RefreshExpires,
                    updated_at = SYSUTCDATETIME()
                WHERE id = @Id;";

            await db.ExecuteAsync(SAVE_REFRESH, new { RefreshToken = refresh, RefreshExpires = refreshExp, user.Id });

            return Ok(new AuthResponse
            {
                AccessToken = access,
                AccessTokenExpiresAt = accessExp,
                RefreshToken = refresh,
                RefreshTokenExpiresAt = refreshExp,
                User = new { id = user.Id, email = user.Email, role = user.Role }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
        {
            await using var db = new SqlConnection(_connectionString);
            const string CLEAR = @"
                UPDATE dbo.[users]
                SET refresh_token = NULL,
                    refresh_token_expires = NULL,
                    updated_at = SYSUTCDATETIME()
                WHERE refresh_token = @RefreshToken;";
            var affected = await db.ExecuteAsync(CLEAR, new { req.RefreshToken });
            return affected > 0 ? NoContent() : NotFound();
        }
    }
}
