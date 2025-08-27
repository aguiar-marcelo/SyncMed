using Dapper;
using Microsoft.AspNetCore.Mvc;
using syncmed.Entities;
using syncmed.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.Data.SqlClient;

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
            const string sql = "SELECT * FROM patient ORDER BY Id DESC";
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

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            // saneamento básico
            if (page < 1) page = 1;
            if (limit < 1) limit = 20;

            await using var sql = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);

            const string COUNT_SQL = @"SELECT COUNT(1) FROM patient";

            const string DATA_SQL = @"
            SELECT *
            FROM patient
            ORDER BY Id DESC
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;";

            var totalItems = await sql.ExecuteScalarAsync<int>(COUNT_SQL);

            var data = await sql.QueryAsync<Patient>(
                DATA_SQL,
                new
                {
                    Offset = (page - 1) * limit,
                    Limit = limit
                });

            var totalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)limit);

            return Ok(new
            {
                currentPage = page,
                totalPages,
                totalItems,
                data
            });
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PatientInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            using var sqlConnection = new SqlConnection(_connectionString);

            const string insertSql = @"
            INSERT INTO patient (Name, Cpf, BirthDate, Contact, ContactSecundary, Email)
            VALUES (@Name, @Cpf, @BirthDate, @Contact, @ContactSecundary, @Email);
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
                Cpf = @Cpf,
                BirthDate = @BirthDate,
                Contact = @Contact,
                ContactSecundary = @ContactSecundary,
                Email = @Email
            WHERE Id = @Id;";

            var affected = await sqlConnection.ExecuteAsync(updateSql, new
            {
                Id = id,
                req.Name,
                req.Cpf,
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await using var sql = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);

            const string DEL = @"DELETE FROM patient WHERE Id = @Id;";
            var affected = await sql.ExecuteAsync(DEL, new { Id = id });

            if (affected == 0) return NotFound(); 
            return NoContent();
        }

    }
}