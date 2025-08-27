using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using syncmed.Entities;
using syncmed.Models;

namespace syncmed.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessionalController : ControllerBase
    {
        private readonly string _connectionString;

        public ProfessionalController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("syncmed");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            const string sql = @"
            SELECT
                p.Id                AS Id,
                p.Name              AS Name,
                p.Contact           AS Contact,
                p.ContactSecundary  AS ContactSecundary,
                p.Email             AS Email,
                s.Id                AS SpecialtyId,
                s.Id                AS Id,
                s.Name              AS Name
            FROM professional p
            JOIN specialty s ON s.Id = p.IdSpecialty
            ORDER BY p.Id DESC;";

            await using var db = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);

            var list = await db.QueryAsync<ProfessionalOutputModel, SpecialtyDto, ProfessionalOutputModel>(
                sql,
                (p, s) => { p.Specialty = s; return p; },
                splitOn: "SpecialtyId"
            );

            return Ok(list);
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            if (page < 1) page = 1;
            if (limit < 1) limit = 20;

            const string COUNT_SQL = @"SELECT COUNT(1) FROM professional;";
            const string DATA_SQL = @"
            SELECT
                p.Id                AS Id,
                p.Name              AS Name,
                p.Contact           AS Contact,
                p.ContactSecundary  AS ContactSecundary,
                p.Email             AS Email,
                s.Id                AS SpecialtyId, 
                s.Id                AS Id,
                s.Name              AS Name
            FROM professional p
            JOIN specialty s ON s.Id = p.IdSpecialty
            ORDER BY p.Id DESC
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;";

            await using var db = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);

            var totalItems = await db.ExecuteScalarAsync<int>(COUNT_SQL);

            var data = await db.QueryAsync<ProfessionalOutputModel, SpecialtyDto, ProfessionalOutputModel>(
                DATA_SQL,
                (p, s) => { p.Specialty = s; return p; },
                new { Offset = (page - 1) * limit, Limit = limit },
                splitOn: "SpecialtyId"
            );

            var totalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)limit);

            return Ok(new { currentPage = page, totalPages, totalItems, data });
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            const string sql = @"
            SELECT
                p.Id                AS Id,
                p.Name              AS Name,
                p.Contact           AS Contact,
                p.ContactSecundary  AS ContactSecundary,
                p.Email             AS Email,
                s.Id                AS SpecialtyId,
                s.Id                AS Id,
                s.Name              AS Name
            FROM professional p
            JOIN specialty s ON s.Id = p.IdSpecialty
            WHERE p.Id = @id;";

            await using var db = new Microsoft.Data.SqlClient.SqlConnection(_connectionString);

            var item = (await db.QueryAsync<ProfessionalOutputModel, SpecialtyDto, ProfessionalOutputModel>(
                sql,
                (p, s) => { p.Specialty = s; return p; },
                new { id },
                splitOn: "SpecialtyId"
            )).SingleOrDefault();

            if (item is null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProfessionalInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            await using var db = new SqlConnection(_connectionString);

            const string checkSql = @"SELECT COUNT(1) FROM specialty WHERE id = @IdSpecialty;";
            const string insertSql = @"
                INSERT INTO professional (name, contact, contactSecundary, email, IdSpecialty)
                VALUES (@Name, @Contact, @ContactSecundary, @Email, @IdSpecialty);
                SELECT CAST(SCOPE_IDENTITY() AS int);";


            var fk = await db.ExecuteScalarAsync<int>(checkSql, new { req.IdSpecialty });
            if (fk == 0) return BadRequest(new { error = "Specialty not found." });

            var newId = await db.ExecuteScalarAsync<int>(insertSql, req);

            const string selectSql = "SELECT * FROM professional WHERE Id = @Id";
            var created = await db.QuerySingleAsync<Professional>(selectSql, new { Id = newId });

            return CreatedAtAction(nameof(GetById), new { id = newId }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProfessionalInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            const string checkSql = @"SELECT COUNT(1) FROM specialty WHERE id = @IdSpecialty;";
            const string updateSql = @"
                UPDATE professional SET
                    name = @Name,
                    contact = @Contact,
                    contactSecundary = @ContactSecundary,
                    email = @Email,
                    IdSpecialty = @IdSpecialty
                WHERE id = @Id;";

            await using var db = new SqlConnection(_connectionString);

            var fk = await db.ExecuteScalarAsync<int>(checkSql, new { req.IdSpecialty });
            if (fk == 0) return BadRequest(new { error = "Specialty not found." });

            var affected = await db.ExecuteAsync(updateSql, new
            {
                Id = id,
                req.Name,
                req.Contact,
                req.ContactSecundary,
                req.Email,
                req.IdSpecialty
            });

            if (affected == 0) return NotFound();

            const string selectSql = "SELECT * FROM professional WHERE Id = @Id";
            var updated = await db.QuerySingleAsync<Professional>(selectSql, new { Id = id });
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            const string DEL = @"DELETE FROM professional WHERE id = @Id;";
            await using var db = new SqlConnection(_connectionString);
            try
            {
                var affected = await db.ExecuteAsync(DEL, new { Id = id });
                if (affected == 0) return NotFound();
                return NoContent();
            }
            catch (SqlException ex) when (ex.Number == 547)
            {
                return Conflict(new { error = "Cannot delete Professional with related records." });
            }
        }

        [HttpGet("Specialtys")]
        public async Task<IActionResult> GetAllSpecialties()
        {
            const string sql = @" SELECT * FROM specialty ORDER BY name ASC;";

            await using var db = new SqlConnection(_connectionString);
            var specialtys = await db.QueryAsync<Specialty>(sql);
            return Ok(specialtys);
        }

    }
}
