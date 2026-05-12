using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrasasOS.Models
{
    [Table("pedidos")]
    public class Pedido : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        [Column("mesa")]
        public string Mesa { get; set; }

        [Column("total")]
        public decimal Total { get; set; }

        [Column("estado")] // Ej: "Pendiente", "Pagado", "Cancelado"
        public string Estado { get; set; }

        [Column("usuario_id")] // Relación con el usuario que tomó el pedido
        public int UsuarioId { get; set; }
    }
}