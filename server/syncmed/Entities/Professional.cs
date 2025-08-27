namespace syncmed.Entities
{
    public class Professional
    {
        protected Professional() { }

        public Professional(string name, string? contact, string? contactSecundary, string? email, int idSpecialty)
        {
            Name = name;
            Contact = contact;
            ContactSecundary = contactSecundary;
            Email = email;
            IdSpecialty = idSpecialty;
        }

        public int Id { get; private set; }
        public string Name { get; private set; } = default!;
        public string? Contact { get; private set; }
        public string? ContactSecundary { get; private set; }
        public string? Email { get; private set; }
        public int IdSpecialty { get; private set; }
    }
}
