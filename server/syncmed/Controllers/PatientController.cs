using Dapper;
using Microsoft.AspNetCore.Mvc;
using syncmed.Entities;
using syncmed.Models;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

namespace syncmed.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly string _connectionString;

        public PatientController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("syncmed");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            using var sqlConnection = new SqlConnection(_connectionString);
            const string sql = "SELECT * FROM patient";
            var patients = await sqlConnection.QueryAsync<Patient>(sql);
            return Ok(patients);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            using var sqlConnection = new SqlConnection(_connectionString);
            const string sql = "SELECT * FROM patient WHERE Id = @id";
            var patient = await sqlConnection.QuerySingleOrDefaultAsync<Patient>(sql, new { id });
            if (patient is null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PatientInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            using var sqlConnection = new SqlConnection(_connectionString);

            const string insertSql = @"
            INSERT INTO patient (Name, BirthDate, Contact, ContactSecundary, Email)
            VALUES (@Name, @BirthDate, @Contact, @ContactSecundary, @Email);
            SELECT CAST(SCOPE_IDENTITY() AS int);";

            var newId = await sqlConnection.ExecuteScalarAsync<int>(insertSql, req);

            const string selectSql = "SELECT * FROM patient WHERE Id = @Id";
            var created = await sqlConnection.QuerySingleAsync<Patient>(selectSql, new { Id = newId });

            return CreatedAtAction(nameof(GetById), new { id = newId }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] PatientInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            using var sqlConnection = new SqlConnection(_connectionString);

            const string updateSql = @"
            UPDATE patient SET
                Name = @Name,
                BirthDate = @BirthDate,
                Contact = @Contact,
                ContactSecundary = @ContactSecundary,
                Email = @Email
            WHERE Id = @Id;";

            var affected = await sqlConnection.ExecuteAsync(updateSql, new
            {
                Id = id,
                req.Name,
                req.BirthDate,
                req.Contact,
                req.ContactSecundary,
                req.Email
            });

            if (affected == 0) return NotFound();

            const string selectSql = "SELECT * FROM patient WHERE Id = @Id";
            var updated = await sqlConnection.QuerySingleAsync<Patient>(selectSql, new { Id = id });

            return Ok(updated);
        }
    }
}