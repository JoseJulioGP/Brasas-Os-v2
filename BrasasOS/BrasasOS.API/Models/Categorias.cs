using Supabase.Postgrest.Attributes; 
using Supabase.Postgrest.Models;     

namespace BrasasOS.Models 
{
    [Table("categorias")]
    public class Categorias : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }
    }
}