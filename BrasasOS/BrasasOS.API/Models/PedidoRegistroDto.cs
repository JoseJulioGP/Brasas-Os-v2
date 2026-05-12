using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
namespace BrasasOS.Models
{
    public class PedidoRegistroDto
    {
        // Datos de la Cabecera del Pedido
        public long UsuarioId { get; set; }
        public string Mesa { get; set; } = string.Empty;
        public float Total { get; set; }

        // Lista de productos que vienen en el pedido
        public List<DetallePedidoDto> Productos { get; set; } = new List<DetallePedidoDto>();
    }

    public class DetallePedidoDto
    {
        public long ProductoId { get; set; }
        public int Cantidad { get; set; }
        public float PrecioUnitario { get; set; }
    }
}
