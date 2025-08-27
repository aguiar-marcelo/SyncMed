namespace syncmed.Entities
{
    public class Patient
    {
        protected Patient() { }
        public Patient(string name, string cpf, DateTime birthDate, string contact, string contactSecundary, string email)
        {
            Name = name;
            Cpf = cpf;
            BirthDate = birthDate;
            Contact = contact;
            ContactSecundary = contactSecundary;
            Email = email;
        }

        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Cpf { get; private set; }
        public DateTime BirthDate { get; private set; }
        public string Contact { get; private set; }
        public string? ContactSecundary { get; private set; } = string.Empty;
        public string Email { get; private set; }
    }
}
