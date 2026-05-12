using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrasasOS.Models
{
    [Table("detalles_pedido")]
    public class DetallePedido : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("pedido_id")]
        public int PedidoId { get; set; }

        [Column("producto_id")]
        public int ProductoId { get; set; }

        [Column("cantidad")]
        public int Cantidad { get; set; }

        [Column("precio_unitario")]
        public decimal PrecioUnitario { get; set; }
    }
}