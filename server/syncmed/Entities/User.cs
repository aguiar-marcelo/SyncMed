namespace syncmed.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = default!;
        public byte[] Password_Hash { get; set; } = default!;
        public byte[] Password_Salt { get; set; } = default!;
        public string? Role { get; set; } = "user";
        public string? Refresh_Token { get; set; }
        public DateTime? Refresh_Token_Expires { get; set; }
    }
}
